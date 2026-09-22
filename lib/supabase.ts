import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handleFileUpload = async (file: File) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size should be less than 5MB");
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only image files (JPEG, PNG, GIF, WEBP) are allowed");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    console.log(
      "Uploading file:",
      fileName,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from("chat_images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(error.message);
    }

    console.log("Upload success:", data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("chat_images")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    console.log("Public URL:", publicUrl);

    return publicUrl;
  } catch (error) {
    console.error("Error in handleFileUpload:", error);
    throw error;
  }
};
