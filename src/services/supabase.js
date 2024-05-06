import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qsajpsacfswygykjjprc.supabase.co",
  process.env.REACT_APP_SUPABASE_SECRET
);

export default supabase;
