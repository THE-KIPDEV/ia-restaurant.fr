import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace IA Restaurant",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0 matrix-bg">
      <div className="absolute inset-0 hero-gradient opacity-30" />
      <div className="relative">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface-2 border border-border-dim shadow-2xl",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-secondary",
              socialButtonsBlockButton:
                "bg-surface-3 border-border-default text-text-primary hover:bg-surface-4",
              formFieldInput:
                "bg-surface-3 border-border-default text-text-primary",
              formButtonPrimary:
                "bg-neon hover:bg-neon-dim text-surface-0",
              footerActionLink: "text-neon hover:text-neon-dim",
            },
          }}
        />
      </div>
    </div>
  );
}
