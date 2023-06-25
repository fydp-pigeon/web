import { authOptions } from "../../api/auth/[...nextauth]/route";
import SignIn from "./components/SignIn";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/auth/signout");
  }

  return <SignIn />;
}
