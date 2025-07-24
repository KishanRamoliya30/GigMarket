import { getUserFromSession } from "@/lib/getCurrentUser";
import { serializeDoc } from "@/utils/serialize";
import { cookies } from "next/headers";

export async function getLoggedInUser() {
  const cookieStore = cookies();
  const user = await getUserFromSession(cookieStore);
  return user ? serializeDoc(user) : null;
}
