import { supabase } from "@/src/utils/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ROUTES from "../utils/routes";

const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push(ROUTES.LOGIN_PAGE);
      }
    };

    getSession();
  }, [router]);
};

export default useAuthRedirect;
