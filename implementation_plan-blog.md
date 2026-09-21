# Implementasi Fitur Manage Blog

Dokumen ini merangkum rancangan arsitektur untuk fitur manajemen blog (Artikel) di Vectyz, mencakup desain skema database, rute backend, dan alur kerja (workflow) secara keseluruhan. Rencana ini telah disesuaikan berdasarkan diskusi terbaru.

## 1. Database Schema Design (Prisma)

Untuk mendukung antarmuka yang ada (`Posts`, `Taxonomy`, `Authors`, `Settings`), kita akan menambahkan entitas baru di Prisma:

### A. `BlogPost`
Tabel utama untuk menyimpan artikel.
- `id` (String / UUID)
- `title` (String): Judul artikel.
- `slug` (String, Unique): URL ramah SEO (contoh: `cara-desain-vektor`).
- `content` (Text/LongText): Isi konten artikel. **Format: Markdown**, dihasilkan oleh Tiptap Editor.
- `excerpt` (String, opsional): Ringkasan singkat untuk *preview*.
- `coverImage` (String, opsional): URL gambar utama (*thumbnail*).
- `status` (Enum: `DRAFT`, `PUBLISHED`): Status rilis artikel (tidak ada *Scheduled*).
- `authorId` (String): Relasi ke tabel `User` yang sudah ada (khusus admin).
- `categoryId` (String, opsional): Relasi **1-to-N** ke tabel `BlogCategory`. (1 Post hanya memiliki 1 Kategori).
- `publishedAt` (DateTime, opsional): Waktu artikel dipublikasikan.
- `seoTitle`, `seoDescription` (String, opsional): Untuk kustomisasi meta khusus artikel ini.
- *Timestamps* (`createdAt`, `updatedAt`).

### B. `BlogCategory` & `BlogTag` (Taxonomy)
Tabel untuk mengelompokkan artikel.
- `BlogCategory`:
  - `id`, `name`, `slug`, `description`
  - Relasi `posts BlogPost[]` (Satu kategori bisa menampung banyak post).
- `BlogTag`:
  - `id`, `name`, `slug`
  - Relasi *many-to-many* dengan `BlogPost`.

### C. `BlogSetting`
Untuk pengaturan SEO global (halaman `Settings`).
- `id` (String)
- `defaultSeoTitle`
- `defaultSeoDescription`
- `defaultSocialImage`
- `facebookUrl`, `twitterUrl`, dll.

## 2. Backend Architecture (API Routes)

Kita akan membuat *namespace* rute baru di backend, misal: `/api/admin/manage-blog/`. Berikut adalah pendekatan pembagian layanannya:

1. **Posts Endpoint (`/posts`)**
   - `GET /` -> List artikel dengan paginasi, filter status (Draft/Published), dan pencarian.
   - `POST /` -> Menyimpan *draft* baru atau langsung rilis.
   - `GET /:id` -> Mengambil detail konten untuk mode Edit.
   - `PATCH /:id` -> *Update* konten, *cover image*, metadata, kategori, dan tags.
   - `DELETE /:id` -> Menghapus artikel.

2. **Taxonomy Endpoint (`/categories` & `/tags`)**
   - `GET`, `POST`, `PATCH`, `DELETE` untuk mengelola daftar kategori dan *tags*.

3. **Settings Endpoint (`/settings`)**
   - `GET /` -> Mengambil pengaturan SEO/konfigurasi global saat ini.
   - `PATCH /` -> Memperbarui konfigurasi.

## 3. Workflow & Cara Kerja

- **Content Format (Markdown vs HTML)**:
  Berdasarkan kode `post-editor-view.tsx` yang Anda berikan, Anda menggunakan Tiptap dengan ekstensi `@tiptap/markdown`. Ini **sangat bagus**. Menggunakan Markdown jauh lebih aman (terhindar dari XSS) dan lebih ringan disimpan di database dibanding HTML mentah. Nantinya di *Client Web* (Front-end pengunjung), kita tinggal merender string Markdown tersebut menjadi HTML menggunakan komponen seperti `react-markdown`.
- **Proses Penyimpanan Artikel**:
  Saat Admin menekan tombol "Publish Now" atau "Save" (Draft), seluruh *state* dari editor (termasuk *output* markdown), judul, status (Public/Private), kategori (ID tunggal), dan Tags (Array ID), akan dikirim ke backend melalui `POST /posts` atau `PATCH /posts/:id`.
- **Public API (Untuk Client Web)**:
  Endpoint publik (`/api/blog/posts`) hanya akan mengembalikan artikel yang berstatus `PUBLISHED`. Tidak perlu memikirkan *scheduler* karena artikel yang `PUBLISHED` akan langsung tampil.

## Langkah Selanjutnya (Action Plan)

Jika Anda sudah setuju dengan rancangan akhir ini, kita bisa mulai mengeksekusinya secara berurutan:
1. Memperbarui `schema.prisma` dan menjalankan `npx prisma db push`.
2. Membuat modul Backend (Routes, Controllers, Services, dan Zod Validators) untuk **Taxonomy** (Kategori & Tag) terlebih dahulu, karena Postingan Blog akan membutuhkan Kategori dan Tag.
3. Membuat modul Backend untuk **Blog Posts**.
4. Menghubungkan Form di Frontend (`post-editor-view.tsx` dan tabel) dengan API menggunakan React Query dan React Hook Form.

> [!NOTE]
> Semua keputusan sudah final berdasarkan jawaban Anda. Jika ada tambahan atau perbaikan sebelum kita ke tahap eksekusi (menulis kode di `schema.prisma`), silakan sampaikan!
