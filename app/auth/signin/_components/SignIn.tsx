"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";

export default function SignIn() {
  const handleSignIn = () => {
    signIn("google");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleSignIn}>Sign in with Google</button>
    </div>
  );
}