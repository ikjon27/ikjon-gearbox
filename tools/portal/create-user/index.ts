// IKJON portal — "create-user" Supabase Edge Function.
// Creates a login for a teacher or student. Only the owner (any role) or a teacher
// (students in their own groups only) may call it. The service-role key stays on Supabase's
// server as an automatic secret and is never sent to the browser.
//
// Deploy: Supabase → Edge Functions → "Deploy a new function" → "Via editor",
// name it  create-user , paste this file, Deploy.
import { createClient } from "jsr:@supabase/supabase-js@2";

const ORIGIN = "https://www.ikjon-gearbox.com";
const cors = {
  "Access-Control-Allow-Origin": ORIGIN,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  // who is calling?
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
  const { data: who } = await admin.auth.getUser(jwt);
  if (!who?.user) return json({ error: "Not signed in" }, 401);
  const { data: caller } = await admin.from("profiles").select("role,active").eq("id", who.user.id).single();
  if (!caller?.active || !["owner", "teacher"].includes(caller.role)) return json({ error: "Not allowed" }, 403);

  let body: { full_name?: string; login?: string; password?: string; role?: string; group_id?: string };
  try { body = await req.json(); } catch { return json({ error: "Bad request" }, 400); }
  const fullName = String(body.full_name || "").trim().slice(0, 80);
  const role = body.role === "teacher" ? "teacher" : "student";
  const groupId = body.group_id || null;
  let login = String(body.login || "").trim().toLowerCase();
  const password = String(body.password || "");
  if (!fullName || !login || password.length < 10) return json({ error: "Name, login and a 10+ character password are needed" }, 400);
  if (!/^[a-z0-9._@-]{3,64}$/.test(login)) return json({ error: "Login may use letters, numbers, dot, dash, underscore" }, 400);
  if (!login.includes("@")) login = `${login}@users.ikjon-gearbox.com`;   // usernames become internal addresses

  // teachers may only create students for groups they teach
  if (caller.role === "teacher") {
    if (role !== "student" || !groupId) return json({ error: "Teachers can only add students to their own groups" }, 403);
    const { data: g } = await admin.from("groups").select("id").eq("id", groupId).eq("teacher_id", who.user.id).maybeSingle();
    if (!g) return json({ error: "Not your group" }, 403);
  }

  const { data: created, error } = await admin.auth.admin.createUser({ email: login, password, email_confirm: true, user_metadata: { full_name: fullName } });
  if (error || !created.user) return json({ error: error?.message || "Could not create login" }, 400);

  const uid = created.user.id;
  const { error: pErr } = await admin.from("profiles").insert({ id: uid, full_name: fullName, role });
  if (pErr) { await admin.auth.admin.deleteUser(uid); return json({ error: "Could not save profile" }, 500); }
  if (groupId) await admin.from("group_members").insert({ group_id: groupId, user_id: uid });

  return json({ ok: true, id: uid, login });
});
