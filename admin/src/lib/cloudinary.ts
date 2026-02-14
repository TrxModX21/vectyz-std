type UploadResult = {
  url: string;
  publicId: string;
};

export const uploadSingleFile = async (
  file: File,
  folder?: string,
): Promise<UploadResult> => {
  // Ambil credential dari env
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials missing");
  }

  // Siapkan form data
  const formData = new FormData();
  formData.append("file", file as any);
  formData.append("upload_preset", uploadPreset);

  // Masukkan folder jika ada
  if (folder) {
    formData.append("folder", folder);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
};

export type CloudinaryResponse = {
  url: string;
  publicId: string;
};

export const uploadToCloudinary = async (
  files: File | File[],
  folder?: string,
): Promise<CloudinaryResponse | CloudinaryResponse[]> => {
  // Jika array (Multiple)
  if (Array.isArray(files)) {
    const promises = files.map((file) => uploadSingleFile(file, folder));
    return await Promise.all(promises);
  }

  // Jika single
  return await uploadSingleFile(files, folder);
};

// Contoh Cara Penggunaan
// 1. Upload Single (misal buat Category):

// typescript
// Folder otomatis jadi 'vectyz/categories' (sesuai parameter kedua)
// const url = await uploadToCloudinary(fileGambar, "vectyz/categories");
// console.log(url); // Output: "https://..."
// 2. Upload Multiple (misal buat Gallery Produk):

// typescript
// const files = [file1, file2, file3]; // Array of File
// const urls = await uploadToCloudinary(files, "vectyz/products");
// console.log(urls); // Output: ["https://...", "https://...", "https://..."]
