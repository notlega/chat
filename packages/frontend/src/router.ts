import { route } from "@typeroute/router";
import { Chat } from "@/routes/chat";
import { SignIn } from "@/routes/sign-in";
import { auth } from "./middleware";

const chat = route("/").use(auth).component(Chat);
const signIn = route("/sign-in").component(SignIn);

export const routes = { chat, signIn };
