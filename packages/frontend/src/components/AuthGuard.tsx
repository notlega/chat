import { Navigate, useOutlet } from "@typeroute/router";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "./ui/spinner";

export function AuthGuard() {
  const outlet = useOutlet();
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-dvh w-full items-center justify-center p-4">
        <Spinner className="size-16" />
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/sign-in" />;
  }

  return <>{outlet}</>;
}

export default AuthGuard;
