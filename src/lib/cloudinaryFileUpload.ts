import cloudinary from "@/lib/cloudinary";

interface UploadOptions {
  folder?: string;
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  if (!file) throw new Error("No file provided");

  const nonImageTypes = ["application/pdf"];
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  const fileName = file.name;
  const extension = fileName.split(".").pop();

  const uploadRes = await cloudinary.uploader.upload(base64, {
    folder: options.folder || "uploads",
    resource_type: nonImageTypes.includes(file.type) ? "raw" : "auto",
    format: extension,
  });

  return uploadRes.secure_url;
}
