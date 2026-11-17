import { createBrowserClient, isBrowser } from "@supabase/ssr";

export function createClient() {
  if (!isBrowser()) {
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
