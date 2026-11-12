import { NextResponse } from "next/server";

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message === "UNAUTHORIZED") return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  console.error(error);
  return NextResponse.json({ error: "Request failed" }, { status: 400 });
}
