import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { SignIn } from "@/routes/sign-in";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  signInAnonymous: vi.fn(),
  navigate: vi.fn(),
  toastAdd: vi.fn(),
}));

vi.mock("@/components/ui/toast", () => ({
  toast: { add: mocks.toastAdd },
}));
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: mocks.getSession,
    signIn: { anonymous: mocks.signInAnonymous },
  },
}));
vi.mock("@typeroute/router", () => ({
  useRouter: () => ({
    navigate: mocks.navigate,
  }),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("SignIn", () => {
  test("should show info toast and navigate when already signed in", async () => {
    mocks.getSession.mockResolvedValue({
      data: {
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
      },
      error: null,
    });
    const user = userEvent.setup();

    render(<SignIn />);

    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        type: "info",
        title: "Already signed in",
        description: "You are already signed in. Redirecting to chat...",
      });
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/" });
    });
    expect(mocks.signInAnonymous).not.toHaveBeenCalled();
  });

  test("should sign in anonymously and navigate on success", async () => {
    mocks.getSession.mockResolvedValue({
      data: null,
      error: null,
    });
    mocks.signInAnonymous.mockResolvedValue({
      data: {
        user: {
          id: "u1",
          name: "anonymous",
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
      },
      error: null,
    });
    const user = userEvent.setup();

    render(<SignIn />);
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        type: "success",
        title: "Successfully signed in. Redirecting to chat...",
      });
      expect(mocks.navigate).toHaveBeenCalledWith({ to: "/" });
    });
  });

  test("should show error toast and not navigate when anonymous sign in fails", async () => {
    mocks.getSession.mockResolvedValue({ data: null, error: null });
    mocks.signInAnonymous.mockResolvedValue({
      data: null,
      error: { message: "failed" },
    });
    const user = userEvent.setup();

    render(<SignIn />);

    await user.click(screen.getByRole("button", { name: "Sign In" }));
    await waitFor(() => {
      expect(mocks.toastAdd).toHaveBeenCalledWith({
        type: "error",
        title: "Error signing in",
        description: "failed",
      });
      expect(mocks.navigate).not.toHaveBeenCalled();
    });
  });
});
