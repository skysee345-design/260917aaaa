import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";

export async function requireAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login?next=/admin");
  if (!currentUser.profile?.is_admin) redirect("/");
  return currentUser;
}
