import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import NewNegotiationForm from "./NewNegotiationForm";
import { cookies } from "next/headers";

export default async function New() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw error;
  }

  const { data: userData } = await supabase
    .from("user")
    .select()
    .eq("userId", user.id)
    .single()
    .throwOnError();

  return (
    <div className="flex-1 flex align-center justify-center">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-lg justify-center gap-2">
        <NewNegotiationForm userData={userData} />
      </div>
    </div>
  );
}
