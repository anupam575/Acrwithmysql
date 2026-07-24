"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function useRoleRedirect(user, authChecked) {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!authChecked || !user?.role?.role_key) return;

    if (hasRedirected.current) return; // 🔥 STOP LOOP

    const roleKey = user.role.role_key;

    let target = "/employee";

    if (roleKey === "admin") target = "/admin";
    else if (roleKey === "hr") target = "/hr";

    hasRedirected.current = true; // 🔥 lock BEFORE navigation

    router.replace(target);

  }, [authChecked, user?.role?.role_key]); // 🔥 IMPORTANT: ONLY stable fields
}