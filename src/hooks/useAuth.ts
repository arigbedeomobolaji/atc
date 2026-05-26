"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirectTo = "/admin/login") {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        setChecking(false);
        if (!json.authenticated) router.push(redirectTo);
      })
      .catch(() => {
        setChecking(false);
        router.push(redirectTo);
      });
  }, [router, redirectTo]);

  return { checking };
}
