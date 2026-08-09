import { middleware } from "@typeroute/router";
import AuthGuard from "@/components/AuthGuard";

export const auth = middleware().component(AuthGuard);
