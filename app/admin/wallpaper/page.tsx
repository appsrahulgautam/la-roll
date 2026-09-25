"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

const STORAGE_BUCKET = "wallpaper";

type Wallpaper = {
  id: string;
  wallpaperUrl: string;
  updatedAt: string;
};

export default function AdminWallpaperPage() {
  const [wallpaper, setWallpaper] =
    useState<Wallpaper | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    loadWallpaper();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const loadWallpaper = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/admin/wallpaper",
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load wallpaper.",
        );
      }

      const data = await response.json();

      setWallpaper(data.wallpaper ?? null);
    } catch (error) {
      console.error(
        "Failed to load wallpaper:",
        error,
      );

      setError(
        "Unable to load current wallpaper.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);
    setSuccess(null);

    // Only allow images
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file.",
      );

      event.target.value = "";
      return;
    }

    // 10 MB maximum
    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Image must be smaller than 10 MB.",
      );

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpdateWallpaper = async () => {
    if (!selectedFile) {
      setError(
        "Please select an image first.",
      );

      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      /*
       * Generate a unique filename.
       *
       * We don't overwrite the previous file.
       * The database simply points to the newest
       * uploaded image.
       */
      const extension =
        selectedFile.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const fileName =
        `wallpaper-${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const filePath = fileName;

      /*
       * Upload directly to Supabase Storage.
       */
      const { error: uploadError } =
        await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(
            filePath,
            selectedFile,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                selectedFile.type,
            },
          );

      if (uploadError) {
        console.error(
          "Supabase upload error:",
          uploadError,
        );

        throw new Error(
          uploadError.message ||
            "Failed to upload image.",
        );
      }

      /*
       * Get public URL.
       */
      const {
        data: publicUrlData,
      } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      const wallpaperUrl =
        publicUrlData.publicUrl;

      if (!wallpaperUrl) {
        throw new Error(
          "Unable to generate wallpaper URL.",
        );
      }

      /*
       * Save URL into our database.
       *
       * This either updates the existing
       * singleton row or creates the first one.
       */
      const response = await fetch(
        "/api/admin/wallpaper",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            wallpaperUrl,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to save wallpaper.",
        );
      }

      setWallpaper(data.wallpaper);

      setSelectedFile(null);
      setPreviewUrl(null);

      /*
       * Reset file input
       */
      const input =
        document.getElementById(
          "wallpaper-upload",
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      setSuccess(
        "Wallpaper updated successfully.",
      );
    } catch (error) {
      console.error(
        "Failed to update wallpaper:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update wallpaper.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-8">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
                <ImageIcon className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">
                  Wallpaper
                </h1>

                <p className="mt-1 text-sm text-zinc-500">
                  Manage the wallpaper displayed
                  across the platform.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadWallpaper}
            disabled={loading || uploading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>
        </div>

        <div className="h-px bg-zinc-200" />

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 p-4">
            <Check className="h-4 w-4 text-green-600" />

            <p className="text-sm font-medium text-green-700">
              {success}
            </p>
          </div>
        )}

        {/* Current Wallpaper */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-zinc-950">
              Current Wallpaper
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              This is the wallpaper currently
              stored in the platform.
            </p>
          </div>

          {loading ? (
            <div className="flex h-72 items-center justify-center rounded-xl bg-zinc-100">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : wallpaper ? (
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              <img
                src={wallpaper.wallpaperUrl}
                alt="Current wallpaper"
                className="max-h-[500px] w-full object-cover"
              />

              <div className="border-t border-zinc-200 bg-white px-4 py-3">
                <p className="text-xs text-zinc-500">
                  Last updated{" "}
                  {new Date(
                    wallpaper.updatedAt,
                  ).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50">
              <ImageIcon className="h-8 w-8 text-zinc-300" />

              <p className="mt-3 text-sm font-medium text-zinc-700">
                No wallpaper has been configured.
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Upload an image below to create
                the first wallpaper.
              </p>
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="mb-5">
            <h2 className="font-semibold text-zinc-950">
              Update Wallpaper
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Select a new image to replace the
              current wallpaper.
            </p>
          </div>

          <label
            htmlFor="wallpaper-upload"
            className="group flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center transition hover:border-zinc-400 hover:bg-zinc-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Upload className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-zinc-900">
              Click to choose an image
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              PNG, JPG, JPEG, WEBP up to 10 MB
            </p>

            <input
              id="wallpaper-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* New image preview */}
          {previewUrl && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    New Wallpaper
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    {selectedFile?.name}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                <img
                  src={previewUrl}
                  alt="New wallpaper preview"
                  className="max-h-[500px] w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdateWallpaper}
                disabled={uploading}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading Wallpaper...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Update Wallpaper
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-sm font-medium text-zinc-900">
            Wallpaper management
          </p>

          <p className="mt-1 text-sm leading-6 text-zinc-500">
            Only one wallpaper is used by the platform.
            Uploading a new image replaces the current
            wallpaper in the database. There is no delete
            option.
          </p>
        </div>
      </div>
    </div>
  );
}