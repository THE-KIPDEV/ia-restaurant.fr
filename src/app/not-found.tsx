import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-0 matrix-bg">
      <div className="absolute inset-0 hero-gradient opacity-20" />
      <div className="relative text-center">
        <h1 className="text-8xl font-extrabold gradient-text">404</h1>
        <p className="mt-4 text-xl text-text-secondary">
          Page introuvable
        </p>
        <Link href="/" className="btn-primary mt-8 inline-block">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
