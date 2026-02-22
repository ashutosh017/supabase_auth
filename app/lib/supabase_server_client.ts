// import { createBrowserClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'

// declare global {
//     var supabase_ssr: ReturnType<typeof createClient> | undefined
// }
// const supabase_ssr = globalThis.supabase_ssr ?? createClient();
// if (process.env.NODE_ENV !== 'production') {
//     globalThis.supabase_ssr = supabase_ssr
// }
// async function createClient() {
//     const cookieStore = await cookies()
// return createBrowserClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: async () => cookieStore.getAll(),
//                 setAll: async (_cookies) => _cookies.forEach((c) => cookieStore.set(c.name, c.value, c.options))
//             }
//         }
//     )
// }

// export default supabase_ssr;


// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch (error) {
                        // This catch is required! If a Server Component tries to set a cookie 
                        // after the response headers have already been sent, it throws an error.
                    }
                },
            },
        }
    )
}