import { Link, useRouter } from "@typeroute/router";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

export function SignIn() {
  const router = useRouter();
  const form = useForm();

  const onSubmit = async () => {
    const { data: existingUser } = await authClient.getSession();

    if (existingUser) {
      toast.add({
        type: "info",
        title: "Already signed in",
        description: "You are already signed in. Redirecting to chat...",
      });

      router.navigate({ to: "/" });
      return;
    }

    const newUser = await authClient.signIn.anonymous();

    if (newUser.error) {
      toast.add({
        type: "error",
        title: "Error signing in",
        description:
          newUser.error.message ||
          "Unknown error occured while trying to sign in.",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Successfully signed in. Redirecting to chat...",
    });

    router.navigate({ to: "/" });
    return;
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form
            id="sign-in"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="font-bold text-3xl">Sign In</h1>
              </div>
              <Field>
                <Button
                  form="sign-in"
                  type="submit"
                  className="hover:cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <Spinner className="size-6" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <Link to="/">Terms of Service</Link> and{" "}
            <Link to="/">Privacy Policy</Link>.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
