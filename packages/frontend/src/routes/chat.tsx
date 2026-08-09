import {
  type MessageWithUser,
  messagesWithPaginationSchema,
  messageWithUserSchema,
} from "@chat/contracts";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowNarrowRight, IconLogout2 } from "@tabler/icons-react";
import { useRouter } from "@typeroute/router";
import type { PublicationContext } from "centrifuge";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { centrifuge, chatSubscription } from "@/lib/centrifuge";
import { cn, mergeDedupeSort } from "@/lib/utils";

const messageSchema = z.object({
  message: z.string().trim().min(1),
});

const url = new URL(`${import.meta.env.VITE_SERVER_URL}/messages`);

const errorToast = (message: string) =>
  toast.add({ type: "error", title: "Error", description: message });

export function Chat() {
  const [isCsrfTokenLoading, setIsCsrfTokenLoading] = useState<boolean>(false);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageWithUser>>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [nextOffset, setNextOffset] = useState<number>(0);
  const { data: sessionData, isPending: isSessionPending } =
    authClient.useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });
  const { message } = useWatch({ control: form.control });
  const isMessageEmpty = !message?.trim();

  const onSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.add({
        type: "error",
        title: "Sign out failed",
        description:
          error.message ||
          "An unknown error occurred while trying to sign out.",
      });
    }

    return router.navigate({ to: "/sign-in" });
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (csrfToken === "") {
      toast.add({
        type: "error",
        title: "Invalid CSRF token",
        description:
          "CSRF token is invalid. Please refresh the page and try again.",
      });

      return;
    }

    if (!sessionData) {
      toast.add({
        type: "error",
        title: "Not signed in",
        description: "You must be signed in to send a message",
      });

      return onSignOut();
    }

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ content: data.message }),
    });

    if (!response.ok) {
      errorToast("Failed to send message");

      return;
    }

    form.resetField("message");
  };

  const getMessages = async (offset: number) => {
    try {
      setIsMessagesLoading(true);
      const target = new URL(url);
      target.searchParams.append("offset", offset.toString());
      const response = await fetch(target, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to load messages");
      }

      const { messages, hasMore } = messagesWithPaginationSchema.parse(
        await response.json(),
      );

      if (messages.length !== 0) {
        setMessages((prevMessages) =>
          mergeDedupeSort<MessageWithUser>(
            prevMessages,
            messages,
            (message) => message.id,
            (message) => message.createdAt,
          ),
        );
      }

      setHasMore(hasMore);
      setNextOffset(offset + messages.length);
    } catch (error) {
      let errorMessage = "Failed to load messages";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorToast(errorMessage);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    await getMessages(nextOffset);
    setIsLoadingMore(false);
  };

  const getCsrfToken = async () => {
    try {
      setIsCsrfTokenLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/csrf-token`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to get CSRF token");
      }

      const { csrfToken } = (await response.json()) as { csrfToken: string };

      setCsrfToken(csrfToken);
    } catch (error) {
      let errorMessage = "Failed to get CSRF token";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      errorToast(errorMessage);
    } finally {
      setIsCsrfTokenLoading(false);
    }
  };

  useEffect(() => {
    getCsrfToken();
    getMessages(0);
    centrifuge.connect();
    chatSubscription.subscribe();

    let hasConnectedBefore = false;

    const onConnected = () => {
      if (hasConnectedBefore) return;

      getMessages(0);
      hasConnectedBefore = true;
    };

    const onPublication = (context: PublicationContext): void => {
      const message = messageWithUserSchema.parse(context.data);

      setMessages((prevMessages) =>
        mergeDedupeSort<MessageWithUser>(
          prevMessages,
          [{ ...message }],
          (message) => message.id,
          (message) => message.createdAt,
        ),
      );
    };

    centrifuge.on("connected", onConnected);
    chatSubscription.on("publication", onPublication);

    return () => {
      centrifuge.off("connected", onConnected);
      chatSubscription.off("publication", onPublication);
      chatSubscription.unsubscribe();
      centrifuge.disconnect();
    };
  }, []);

  if (
    isSessionPending &&
    isCsrfTokenLoading &&
    isMessagesLoading &&
    !sessionData
  ) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-2 p-2">
      <nav className="flex h-12 shrink-0 flex-row items-center justify-center">
        <Button
          variant="default"
          className="absolute left-2 size-10 hover:cursor-pointer"
          onClick={onSignOut}
        >
          <IconLogout2 className="size-6" />
        </Button>
        <h2 className="font-bold text-2xl">CHAT</h2>
      </nav>
      {hasMore && (
        <Button
          className="shrink-0 hover:cursor-pointer"
          onClick={loadMoreMessages}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? <Spinner className="size-6" /> : "Load older"}
        </Button>
      )}
      <div className="flex min-h-0 flex-1 flex-col-reverse gap-2 overflow-y-auto">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={cn(
              "wrap-break-word w-5/6 gap-2 overflow-visible border border-white p-2 *:p-0",
              message.user.id === sessionData?.user.id && "self-end",
            )}
          >
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span className="font-bold">{message.user.name}</span>
                <span className="font-normal opacity-70">
                  {message.createdAt
                    .toLocaleTimeString()
                    .replace(/:\d{2}$/, "")}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{message.content}</CardContent>
          </Card>
        ))}
      </div>
      <form
        className="bottom-0 shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup>
          <Controller
            name="message"
            control={form.control}
            render={({ field, formState }) => (
              <Field>
                <ButtonGroup className="flex gap-1">
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Message"
                    aria-disabled={field.disabled}
                    autoComplete="off"
                  />
                  <Button
                    className="hover:cursor-pointer"
                    type="submit"
                    disabled={
                      csrfToken === "" ||
                      isMessageEmpty ||
                      formState.isSubmitting
                    }
                    aria-disabled={
                      csrfToken === "" ||
                      isMessageEmpty ||
                      formState.isSubmitting
                    }
                  >
                    {formState.isSubmitting ? (
                      <Spinner className="size-6" />
                    ) : (
                      <IconArrowNarrowRight className="size-6" />
                    )}
                  </Button>
                </ButtonGroup>
              </Field>
            )}
          ></Controller>
        </FieldGroup>
      </form>
    </div>
  );
}

export default Chat;
