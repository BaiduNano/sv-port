import { createClient } from "@supabase/supabase-js";

// This should be safe, public credentials.
const supabaseUrl = "https://isexuebuwdjrzpwwssal.supabase.co";
const supabaseAnonKey = "sb_publishable__Q5ToxizYceAZJnBgHIe7Q_zKN_FkSN";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
