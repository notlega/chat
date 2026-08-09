import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AuthGuard } from "@/components/AuthGuard";
import type { authClient } from "@/lib/auth-client";

type UseSessionReturn = ReturnType<typeof authClient.useSession>;

const sessionState = (
  data: UseSessionReturn["data"],
  isPending = false,
): UseSessionReturn => ({
  data,
  isPending,
  isRefetching: false,
  error: null,
  refetch: async () => {},
});

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: { useSession: mocks.useSession },
}));
vi.mock("@typeroute/router", () => ({
  useOutlet: () => <div>outlet-content</div>,
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
}));

describe("AuthGuard", () => {
  test("should render spinner", () => {
    mocks.useSession.mockReturnValue(sessionState(null, true));

    render(<AuthGuard />);

    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
    expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
  });

  test("should navigate to /sign-in when no session", () => {
    mocks.useSession.mockReturnValue(sessionState(null, false));

    render(<AuthGuard />);

    expect(screen.getByTestId("navigate")).toHaveTextContent("/sign-in");
  });

  test("should render outlet when signed in", () => {
    mocks.useSession.mockReturnValue(
      sessionState({
        user: {
          id: "u1",
          name: "Alice",
          createdAt: new Date(),
          updatedAt: new Date(),
          emailVerified: false,
          image: null,
        },
        session: {
          id: "s1",
          userId: "u1",
          token: "tok",
          expiresAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          ipAddress: null,
          userAgent: null,
        },
      } as UseSessionReturn["data"]),
    );

    render(<AuthGuard />);

    expect(screen.getByText("outlet-content")).toBeInTheDocument();
  });
});
