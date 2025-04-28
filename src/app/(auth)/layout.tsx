import { Suspense } from "react";

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
          Chargement...
        </div>
      }
    >
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
        <main>{children}</main>
      </div>
    </Suspense>
  );
}
