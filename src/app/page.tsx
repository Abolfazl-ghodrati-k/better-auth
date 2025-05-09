"use client";

import { Button } from "@/components/ui/button";
import { client } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { replace } = useRouter();

  useEffect(() => {
    client.getSession().then((session) => {
      if (session.data?.user.email) {
        setUser({ email: session.data.user.email });
      }
    });
  }, []);

  const handleSignOut = () => {
    setIsSigningOut(true);

    client.signOut({
      fetchOptions: {
        onSuccess: () => {
          replace("/auth/signin");
        },
        onError: () => {
          setIsSigningOut(false); // rollback loading state on failure
        },
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-semibold mb-4">
        Welcome {user?.email || "Loading..."}
      </h1>

      <Button
        variant="destructive"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
}
