"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export function AuthForm() {
  const [mode, setMode] = useState<"signin"|"signup">("signup"); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const router=useRouter();
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage("");const form=new FormData(event.currentTarget);const email=String(form.get("email"));const password=String(form.get("password"));const displayName=String(form.get("displayName")??"");const supabase=createSupabaseBrowser();
    if(mode==="signup"){const {data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:displayName},emailRedirectTo:`${window.location.origin}/auth/callback`}});setBusy(false);if(error)return setMessage(error.message);if(!data.session)return setMessage("Check your email to confirm your account, then sign in.");}
    else{const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error)return setMessage(error.message);}
    router.push("/dashboard");router.refresh();
  }
  return <section className="auth-card"><div className="auth-tabs"><button className={mode==="signup"?"active":""} onClick={()=>setMode("signup")}>Create account</button><button className={mode==="signin"?"active":""} onClick={()=>setMode("signin")}>Sign in</button></div><form className="stack" onSubmit={submit}>{mode==="signup"&&<label>Your name<input name="displayName" minLength={2} maxLength={80} required autoComplete="name"/></label>}<label>Email address<input name="email" type="email" required autoComplete="email"/></label><label>Password<input name="password" type="password" minLength={8} required autoComplete={mode==="signup"?"new-password":"current-password"}/></label><button className="button" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create my account":"Sign in"}</button>{message&&<p className="notice" role="status">{message}</p>}</form><p className="fine-print">By creating an account, you acknowledge our <a href="/privacy">privacy notice</a>.</p></section>;
}
