"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
export function SignOutButton(){const router=useRouter();return <button className="nav-button" onClick={async()=>{await createSupabaseBrowser().auth.signOut();router.push("/");router.refresh()}}>Sign out</button>}
