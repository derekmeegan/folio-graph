import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qsajpsacfswygykjjprc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYWpwc2FjZnN3eWd5a2pqcHJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzQ3NDQsImV4cCI6MjAyNTE1MDc0NH0.HRIYU6c6A14qBb-mqGJpklJ1EgV0_kazEAo8qQ9ADZg"
);

export default supabase;
