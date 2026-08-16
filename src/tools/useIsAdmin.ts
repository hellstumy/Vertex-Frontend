import type { User } from "../store/auth.store";

export async function UseIsAdmin(user: User) {
  const isAdmin =
    user?.role === "admin" || user?.role === "owner" ? true : false;
  return isAdmin;
}
