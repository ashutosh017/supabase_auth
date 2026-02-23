"use server";

import { revalidatePath } from "next/cache";
import { ApiResponse } from "../lib/api_response";
import { createClient } from "../lib/supabase_server_client";
import { Base, BaseSchema } from "../types";

export async function uploadBase(prevState: any, formData: FormData): Promise<ApiResponse<string>> {
    const baseLink = formData.get("baseLink") as string;
    const thLevel = Number(formData.get("thLevel"));
    let imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: "You must be signed in to upload a base" };
    }

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
            .from('base-previews')
            .upload(filePath, imageFile);

        if (uploadError) {
            return { success: false, error: "Failed to upload image: " + uploadError.message };
        }

        const { data: { publicUrl } } = supabase.storage
            .from('base-previews')
            .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
    }

    const { error } = await supabase.from('Base').insert({
        link: baseLink,
        preview_img_link: imageUrl,
        th_level: thLevel,
    })

    if (error) {
        console.log("error: ", error)
        return {
            success: false,
            error: error.message
        }
    }

    revalidatePath("/");
    return { success: true, data: "Base uploaded successfully" };
}

export async function getAllBases(): Promise<ApiResponse<Base[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('Base').select('*').order('created_at', { ascending: false });
    
    if (error) return {
        error: error.message,
        success: false
    }

    const parseddata = data.map((d) => BaseSchema.safeParse({
        id: d.id.toString(),
        link: d.link ?? '',
        createdAt: new Date(d.created_at),
        imgUrl: d.preview_img_link ?? '',
        thLevel: d.th_level ?? 1
    })).filter((r) => r.success).map((r) => r.data)
    
    return {
        success: true,
        data: parseddata ?? []
    }
}