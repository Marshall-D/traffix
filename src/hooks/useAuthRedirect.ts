import { useEffect } from "react";
import { useRouter } from "next/router";
import ROUTES from "../utils/routes";

const AUTH_STORAGE_KEY = "traffix_auth";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      const parsed = raw ? JSON.parse(raw) : null;
      const hasToken = parsed?.token;
      if (!hasToken) {
        router.push(ROUTES.LOGIN_PAGE);
      }
    } catch {
      router.push(ROUTES.LOGIN_PAGE);
    }
  }, [router]);
};

export default useAuthRedirect;
