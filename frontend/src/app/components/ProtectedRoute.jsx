"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const PUBLIC_ROUTES = ["/auth", "/forgot-password", "/login"];

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    authChecked,
    isAuthenticated,
    loading,
  } = useSelector((state) => state.auth);

  // =========================
  // ROUTE PROTECTION
  // =========================
  useEffect(() => {
    // ⛔ wait until auth fully checked
    if (!authChecked || loading) return;

    // ⛔ pathname not ready
    if (!pathname) return;

    // ✅ public routes allowed
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) return;

    // =========================
    // NOT AUTHENTICATED
    // =========================
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    // =========================
    // ROLE VALIDATION
    // =========================
    if (allowedRoles.length > 0) {
      const roleKey = user?.role?.role_key;

      const hasAccess = allowedRoles.includes(roleKey);

      if (!hasAccess) {
        router.replace("/");
      }
    }
  }, [
    pathname,
    authChecked,
    loading,
    isAuthenticated,
    user,
    allowedRoles,
    router,
  ]);

  // =========================
  // LOADER
  // =========================
  if (!authChecked || loading) {
    return null;
  }

  // =========================
  // PUBLIC ROUTES DIRECT RENDER
  // =========================
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  if (isPublicRoute) {
    return children;
  }

  // =========================
  // AUTH CHECK
  // =========================
  if (!isAuthenticated) {
    return null;
  }

  // =========================
  // ROLE CHECK
  // =========================
  if (allowedRoles.length > 0) {
    const roleKey = user?.role?.role_key;

    const hasAccess = allowedRoles.includes(roleKey);

    if (!hasAccess) {
      return null;
    }
  }

  // =========================
  // FINAL RENDER
  // =========================
  return children;
};

export default ProtectedRoute;