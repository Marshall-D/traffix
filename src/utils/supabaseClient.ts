import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://olawgfnimopdbzpioqno.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sYXdnZm5pbW9wZGJ6cGlvcW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMjQwODIsImV4cCI6MjAzOTkwMDA4Mn0.mCHF0i8-y2cO1WrvtPd7X7bMPTCR72XeLOEVP61MyIk";

export const supabase = createClient(supabaseUrl, supabaseKey);
