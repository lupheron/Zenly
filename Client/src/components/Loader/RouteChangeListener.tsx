"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "./LoaderContext";

const RouteChangeListener = () => {
  const pathname = usePathname();
  const { setLoading } = useLoader();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate a short loading period (e.g., 400ms)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLoading(false), 400);
    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, setLoading]);

  return null;
};

export default RouteChangeListener;
