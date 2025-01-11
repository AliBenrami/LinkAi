import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY ?? "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const LoginCheck = async (
  loginRef: string | null,
  notLoginRef: string | null
) => {
  const session = await supabase.auth.getSession();

  if (session.data.session === null) {
    console.log("not logged in");
    if (notLoginRef) {
      location.href = notLoginRef;
    }
  } else {
    if (loginRef) {
      location.href = loginRef;
    }
  }
  return !(session.data.session === null);
};
