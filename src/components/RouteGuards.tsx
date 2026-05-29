import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useCart } from "@/context/CartContext";

const PageLoader = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 text-center">
    <p className="animate-pulse text-base sm:text-lg font-medium">{message}</p>
  </div>
);

/** Waits for Clerk to finish loading before redirecting guests. */
export const RequireAuth = ({
  children,
  redirectTo = "/",
}: {
  children: ReactNode;
  redirectTo?: string;
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname + location.search },
      });
      return;
    }

    setAllowed(true);
  }, [isLoaded, isSignedIn, navigate, redirectTo, location.pathname, location.search]);

  if (!isLoaded || !allowed) {
    return <PageLoader message="Loading secure checkout..." />;
  }

  return <>{children}</>;
};

/** Requires a non-empty cart; waits until cart has been read from storage. */
export const RequireCart = ({ children }: { children: ReactNode }) => {
  const { items } = useCart();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [ready, items.length, navigate]);

  if (!ready || items.length === 0) {
    return <PageLoader message="Loading your cart..." />;
  }

  return <>{children}</>;
};
