"use server";

import { ApiResponse } from "../lib/api_response";
import supabase from "../lib/supabase-client";
import { Base, BaseSchema } from "../types";

export async function uploadBase(prevState: any, formData: FormData): Promise<ApiResponse<string>> {
    const baseLink = formData.get("baseLink") as string;
    const thLevel = Number(formData.get("thLevel"));
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File;

    const hasFile = imageFile && imageFile.size > 0;

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

    return { success: true, data: "Base uploaded successfully" };
}

export async function getAllBases(): Promise<ApiResponse<Base[]>> {
    const { data, error } = await supabase.from('Base').select('*');
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