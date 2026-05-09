import { Signup1 } from "@/components/ui/signup-1";

export function AuthDialog({
  error,
  firebaseReady,
  onClose,
  onSignIn,
}: {
  error: string;
  firebaseReady: boolean;
  onClose: () => void;
  onSignIn: () => void;
}) {
  const helperText = firebaseReady
    ? "Google sign-in will sync your Fidel Labs progress across devices."
    : "Firebase keys are not connected yet, so this preview will keep using guest progress.";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm md:p-8" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        <Signup1
          heading="Save your progress"
          logo={{ url: "#", src: "/favicon.svg", alt: "Fidel Labs logo", title: "Fidel Labs" }}
          signupText="Continue with Google"
          googleText="Use Google"
          loginText=""
          loginUrl="#"
          supportingText="Create a free account when you are ready. Guest learning still works."
          helperText={helperText}
          errorText={error}
          onGoogleSignIn={onSignIn}
          skipText="Keep learning as guest"
          onSkip={onClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
