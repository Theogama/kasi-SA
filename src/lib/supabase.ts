import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init) => {
      try {
        return await fetch(input, init);
      } catch (error) {
        if (error instanceof TypeError && (error.message.includes("Failed to fetch") || error.message.includes("fetch"))) {
          console.error("Supabase Network/DNS Connection Failure:", error);
          // Return a structured 503 response. The Supabase client parses this response
          // and places this informative message into the `error.message` field.
          return new Response(
            JSON.stringify({
              code: "P1000",
              message: "Database connection failed. Your Supabase project might be paused or inactive. Please log in to your Supabase Dashboard (https://supabase.com/dashboard) to unpause it, or check your internet connection.",
              details: error.message,
              hint: "Make sure your Supabase project is active and DNS is resolving correctly."
            }),
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: { "Content-Type": "application/json" }
            }
          );
        }
        throw error;
      }
    }
  }
});