import { Centrifuge } from "centrifuge";
import { authClient } from "./auth-client";

export const centrifuge = new Centrifuge(import.meta.env.VITE_CENTRIFUGO_URL, {
  getToken: async () => {
    const { data } = await authClient.$fetch<{ token: string }>("/token");

    if (data === null) {
      throw new Error("unable to fetch token");
    }

    return data.token;
  },
});

export const chatSubscription = centrifuge.newSubscription("chat");
