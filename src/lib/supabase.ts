import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wdpnjxdfdkhvufqljfia.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcG5qeGRmZGtodnVmcWxqZmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjI3NjMsImV4cCI6MjA5Mzg5ODc2M30.jk_Hk0dqAinV6x4YUEBVGNP9VoVyi5M0gF21Rmd0iBY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "fullplay-auth" },
});