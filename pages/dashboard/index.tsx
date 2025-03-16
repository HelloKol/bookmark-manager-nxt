import Link from "next/link";
import React from "react";

export default function index() {
  return (
    <div>
      <Link href="/login">Login</Link>
      <h1 className="text-amber-100 text-3xl">Dashboard</h1>
    </div>
  );
}
