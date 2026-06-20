import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wqngxumoprwumqwatqgb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxbmd4dW1vcHJ3dW1xd2F0cWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MzM5MzIsImV4cCI6MjA5NjMwOTkzMn0.KxgKMyP_8LCu1wDnOHOyeQFC7QvAD6yIcY8JYYrhUOE";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);