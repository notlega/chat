import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Chat } from "@/routes/chat";

type Listener = (ctx?: unknown) => void;

const mocks = vi.hoisted(() => {
  const centrifugeListeners: Record<string, Listener[]> = {};
  const subscriptionListeners: Record<string, Listener[]> = {};

  return {
    fetch: vi.fn(),
    getCsrf: vi.fn(),
    getMessages: vi.fn(),
    postMessage: vi.fn(),
    navigate: vi.fn(),
    addToast: vi.fn(),
    useSession: vi.fn(),
    signOut: vi.fn(),
    centrifuge: {
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn((event: string, listener: Listener) => {
        (centrifugeListeners[event] ?? []).push(listener);
      }),
      off: vi.fn((event: string, listener: Listener) => {
        centrifugeListeners[event] = (centrifugeListeners[event] ?? []).filter(
          (existingListener) => existingListener !== listener,
        );
      }),
    },
    chatSubscription: {
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
      on: vi.fn((event: string, listener: Listener) => {
        (subscriptionListeners[event] ?? []).push(listener);
      }),
      off: vi.fn((event: string, listener: Listener) => {
        subscriptionListeners[event] = (
          subscriptionListeners[event] ?? []
        ).filter((existingListener) => existingListener !== listener);
      }),
    },
    emitConnected: () =>
      (centrifugeListeners.connected ?? []).forEach((listener) => {
        listener();
      }),
    emitPublication: (data: unknown) =>
      (subscriptionListeners.publication ?? []).forEach((listener) => {
        listener({ data } as never);
      }),
  };
});

vi.mock("@/components/ui/toast", () => ({ toast: { add: mocks.addToast } }));
vi.mock("@/lib/auth-client", () => ({
  authClient: { useSession: mocks.useSession, signOut: mocks.signOut },
}));
vi.mock("@/lib/centrifuge", () => ({
  centrifuge: mocks.centrifuge,
  chatSubscription: mocks.chatSubscription,
}));
vi.mock("@typeroute/router", () => ({
  useRouter: () => ({
    navigate: mocks.navigate,
  }),
}));

const sampleMessages = [
  {
    id: "m1",
    userId: "u1",
    content: "Hello there",
    createdAt: "2026-08-08T00:00:00.000Z",
    updatedAt: "2026-08-08T00:00:00.000Z",
    user: { id: "u1", name: "Alice" },
  },
];

const sessionState = (data: unknown, isPending = false) => ({
  data,
  isPending,
  isRefetching: false,
  error: null,
  refetch: async () => {},
});

const jsonResponse = (body: unknown) => ({
  ok: true,
  json: async () => body,
});

beforeEach(() => {
  vi.stubGlobal("fetch", mocks.fetch);
  mocks.useSession.mockReturnValue(
    sessionState({ user: { id: "u1" }, session: { id: "s1" } }),
  );
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.getCsrf.mockResolvedValue(jsonResponse({ csrfToken: "csrf-123" }));
  mocks.getMessages.mockResolvedValue(
    jsonResponse({ messages: sampleMessages, hasMore: false }),
  );
  mocks.postMessage.mockResolvedValue(jsonResponse({}));
  mocks.fetch.mockImplementation(
    (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input.toString();

      if (url.endsWith("/auth/csrf-token")) {
        return mocks.getCsrf();
      }

      if (url.includes("/messages") && init?.method === "POST") {
        return mocks.postMessage(input, init);
      }

      if (url.includes("/messages")) {
        return mocks.getMessages();
      }

      throw new Error(`Unhandled fetch: ${init?.method ?? "GET"} ${url}`);
    },
  );
});

const sendButton = () => {
  const buttons = screen.getAllByRole("button");
  return buttons[buttons.length - 1];
};

describe("Chat", () => {
  test("should render loading spinner", () => {
    mocks.useSession.mockReturnValue(sessionState(null, true));

    render(<Chat />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });

  test("should render messages from the server", async () => {
    render(<Chat />);

    expect(await screen.findByText("Hello there")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Load older" }),
    ).not.toBeInTheDocument();
  });

  test("should disable send button while input is empty", async () => {
    render(<Chat />);

    await waitFor(() => expect(sendButton()).toBeDisabled());
  });

  test("should POST message and clear input on submit", async () => {
    const sentBodies: Array<{ content: string }> = [];
    mocks.postMessage.mockImplementation(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        sentBodies.push(JSON.parse(String(init?.body)) as { content: string });
        return jsonResponse({});
      },
    );
    const user = userEvent.setup();

    render(<Chat />);
    const input = screen.getByPlaceholderText("Message");
    await user.type(input, "hi");
    await waitFor(() => expect(sendButton()).toBeEnabled());
    await user.click(sendButton());

    await waitFor(() => {
      expect(sentBodies).toEqual([{ content: "hi" }]);
      expect(mocks.postMessage).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "X-CSRF-Token": "csrf-123",
          }),
        }),
      );
      expect(input).toHaveValue("");
    });
  });

  test("should show toast when CSRF token fetch fails", async () => {
    mocks.getCsrf.mockResolvedValue({ ok: false, json: async () => ({}) });

    render(<Chat />);

    await waitFor(() =>
      expect(mocks.addToast).toHaveBeenCalledWith({
        type: "error",
        title: "Error",
        description: "Failed to get CSRF token",
      }),
    );
  });

  test("should append message on publication", async () => {
    render(<Chat />);
    await screen.findByText("Hello there");

    act(() =>
      mocks.emitPublication({
        id: "m2",
        userId: "u2",
        content: "Second message",
        createdAt: "2026-08-08T00:01:00.000Z",
        updatedAt: "2026-08-08T00:01:00.000Z",
        user: { id: "u2", name: "Bob" },
      }),
    );

    expect(await screen.findByText("Second message")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("should refetch messages on first centrifuge connect", async () => {
    render(<Chat />);
    await screen.findByText("Hello there");

    act(() => mocks.emitConnected());

    await waitFor(() => expect(mocks.getMessages).toHaveBeenCalledTimes(2));
  });

  test("should sign out and navigate to /sign-in", async () => {
    const user = userEvent.setup();

    render(<Chat />);

    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() =>
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/sign-in" }),
    );
  });
});
