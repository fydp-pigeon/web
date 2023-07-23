'use client';

import { signIn } from "next-auth/react";

export function Menu() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="text-3xl">Pigeon</div>
      <button onClick={() => signIn("google")} className="btn btn-primary py-0 h-0">Sign up</button>
    </div>
  );
}
