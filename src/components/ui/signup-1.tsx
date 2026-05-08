import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title?: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  loginUrl?: string;
  supportingText?: string;
  errorText?: string;
  helperText?: string;
  onGoogleSignIn?: () => void;
}

const Signup1 = ({
  heading,
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  googleText = "Sign up with Google",
  signupText = "Create an account",
  loginText = "Already have an account?",
  loginUrl = "#",
  supportingText,
  errorText,
  helperText,
  onGoogleSignIn,
}: Signup1Props) => {
  return (
    <section className="h-screen bg-muted">
      <div className="flex h-full items-center justify-center px-4">
        <div className="flex w-full max-w-sm flex-col items-center gap-8 rounded-md border border-muted bg-background px-6 py-12 shadow-md">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-1 lg:justify-start">
              <a href={logo.url} aria-label={logo.title ?? logo.alt}>
                <img src={logo.src} alt={logo.alt} title={logo.title} className="h-10 dark:invert" />
              </a>
            </div>
            {heading && <h1 className="text-3xl font-semibold">{heading}</h1>}
            {supportingText && <p className="text-sm leading-6 text-muted-foreground">{supportingText}</p>}
          </div>
          <form className="flex w-full flex-col gap-8" onSubmit={(event) => event.preventDefault()}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Input type="email" placeholder="Email" required />
              </div>
              <div className="flex flex-col gap-2">
                <Input type="password" placeholder="Password" required />
              </div>
              <div className="flex flex-col gap-4">
                <Button type="submit" className="mt-2 w-full">
                  {signupText}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={onGoogleSignIn}>
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button>
              </div>
            </div>
          </form>
          {helperText && <p className="text-center text-xs leading-5 text-muted-foreground">{helperText}</p>}
          {errorText && <p className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">{errorText}</p>}
          <div className="flex justify-center gap-1 text-sm text-muted-foreground">
            <p>{loginText}</p>
            <a href={loginUrl} className="font-medium text-primary hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
