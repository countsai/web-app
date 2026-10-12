import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <>{children}</>;
}
