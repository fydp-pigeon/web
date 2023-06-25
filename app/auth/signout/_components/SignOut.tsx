"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = () => {
    signOut();
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}