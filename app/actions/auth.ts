'use server'
import { ApiResponse } from "../lib/api_response";
// import supabase from "../lib/supabase-client";
import { createClient } from "../lib/supabase_server_client";

export async function signInWithOtp(prevState: any, formData: FormData): Promise<ApiResponse<any>> {
    const email = formData.get("email") as string;
    const token = formData.get("otp") as string;
    const supabase = await createClient();
    if (token) {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: "magiclink",
            // options:{
            //     redirectTo:""
            // }
        });

        if (error) {
            return {
                success: false,
                error: error.message,
                data: { emailSent: true, email }
            };
        }

        return {
            success: true,
            data
        };
    }
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
    });

    if (error) {
        if (error.name === '')
            return { success: false, error: error.message };
    }

    return {
        success: true,
        data: { emailSent: true, email },
        message: "Code sent to your email"
    };
}