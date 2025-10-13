# Knowledge Management System - Frontend

Sebuah aplikasi web modern untuk mengelola dan mengorganisir knowledge base aplikasi RAG tim Anda dengan fitur chat AI yang terintegrasi.

## 🚀 Fitur Utama

- Autentikasi & Proteksi Halaman
  - Login dengan JWT, simpan token di `localStorage`
  - Middleware proteksi via komponen `ProtectedRoute`
  - Logout dan verifikasi token otomatis
- Manajemen Knowledge
  - Lihat daftar knowledge dengan pagination, sorting, dan aksi massal
  - Tambah knowledge manual
  - Lihat, edit, dan hapus knowledge (detail melalui modal)
- Chat AI (RAG)
  - Chat dengan AI yang merujuk ke knowledge base
  - Render Markdown, tabel, dan formula matematika (KaTeX)
  - Lihat sumber referensi yang digunakan AI (Source Modal)
- File Management & Upload
  - Upload file (PDF, TXT, CSV, Excel) untuk diproses menjadi knowledge
  - Kelola file yang sudah diunggah: lihat detail, download, dan hapus
  - Tautan file (mis. Cloudinary) tersedia untuk pratinjau/unduh
- System Prompt Manager
  - Buat, lihat, edit system prompt
  - Set aktif/default, reset ke default
- User Management
  - Lihat daftar pengguna, buat, edit, aktif/nonaktif, hapus
- UI & Notifikasi
  - Komponen UI modern (Radix UI + Tailwind CSS)

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Library JavaScript untuk membangun UI
- **TypeScript** - Superset JavaScript dengan type safety
- **Vite** - Build tool yang cepat dan modern
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Router v7** - Library routing untuk React
- **Redux Toolkit + React Redux** - State management dengan Redux Toolkit
- **React Markdown, Remark GFM, Remark Math, Rehype KaTeX, React KaTeX** - Rendering markdown content dengan support GFM, math formula, dan KaTeX

## 📁 Struktur Proyek

```
Trae

contoh\src\pages\Home.tsx 1 - 200

Thought

Saya akan merapikan halaman Home: menyederhanakan layout, menghapus gradient/glassmorphism, dan mempertahankan warna tema default agar terlihat elegan dan clean.

```
import { Button } from '@/
components/ui/button';
import { Card, CardContent, 
CardDescription, CardHeader, 
CardTitle } from '@/components/ui/
card';
// ... existing code ...
import { LogIn, ShieldCheck, 
Database, FileText } from 
'lucide-react';
import { useNavigate } from 
'react-router-dom';
// ... existing code ...

export const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  // ... existing code ...
  return (
    <div className="min-h-screen 
    bg-background">
      <div className="container 
      mx-auto px-4 py-16">
        {/* Hero */}
        <div className="max-w-3xl 
        mx-auto text-center">
          <h1 className="text-4xl 
          font-bold tracking-tight 
          text-foreground">
            Knowledge Management 
            System
          </h1>
          <p className="mt-3 
          text-muted-foreground">
            Manage and organize 
            your team's knowledge 
            base
          </p>
        </div>

        {/* Welcome Card */}
        <div className="mt-8 
        max-w-md mx-auto">
          <Card>
            <CardHeader 
            className="text-center"
            >
              <CardTitle 
              className="text-2xl">
              Welcome</CardTitle>
              <CardDescription>
                Please login to 
                access the 
                knowledge 
                management system
              </CardDescription>
            </CardHeader>
            <CardContent 
            className="flex 
            justify-center">
              <Button onClick=
              {handleLoginClick} 
              size="lg" 
              className="w-full">
                <LogIn 
                className="w-4 h-4 
                mr-2" />
                Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature grid - 
        simple & neutral */}
        <div className="mt-12 grid 
        grid-cols-1 sm:grid-cols-2 
        lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader 
            className="flex 
            items-center gap-2">
              <ShieldCheck 
              className="w-5 h-5 
              text-muted-foreground
              " />
              <CardTitle 
              className="text-base"
              >Secure</CardTitle>
            </CardHeader>
            <CardContent 
            className="text-sm 
            text-muted-foreground">
              Token-based access 
              to keep data safe.
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
            className="flex 
            items-center gap-2">
              <Database 
              className="w-5 h-5 
              text-muted-foreground
              " />
              <CardTitle 
              className="text-base"
              >Organized</
              CardTitle>
            </CardHeader>
            <CardContent 
            className="text-sm 
            text-muted-foreground">
              Files, prompts, and 
              knowledge in one 
              place.
            </CardContent>
          </Card>

          <Card>
            <CardHeader 
            className="flex 
            items-center gap-2">
              <FileText 
              className="w-5 h-5 
              text-muted-foreground
              " />
              <CardTitle 
              className="text-base"
              >OCR Support</
              CardTitle>
            </CardHeader>
            <CardContent 
            className="text-sm 
            text-muted-foreground">
              Extract text from 
              PDFs for faster 
              search.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  // ... existing code ...
};
```
Perubahan utama:

- Menghapus gradient dan efek blur, kembali ke bg-background tema.
- Hero sederhana, card login, dan grid fitur minimalis.
- Menggunakan text-muted-foreground untuk kesan elegan tanpa mengubah warna tema.
Kalau mau tambah satu section ringan (mis. “recent updates”), saya bisa tambahkan dengan tetap mempertahankan gaya minimalis ini.

Arifian Saputra

Copy

Delete

buat readme baru sesuai fitur yang ada di contoh ,

Trae

Thought process

Creating README

I think I need to focus on producing a README for the project, which sounds important. I should also consider whether to create a to-do list, but it seems the task management advises using a tool called "todo_write" to track tasks. However, there’s no such tool available, so I guess I’ll just move forward without it. It’s a little frustrating, but I’ll keep going with the README instead.

Search codebase for 'Summarize frontend features, pages, and components to document in README: authentication, file management, system prompt manager, chat, knowledge management, protected routes, store setup, env config.'

Search codebase for 'Find routing, pages, and store setup to include in README: App.tsx routes, Home.tsx, Login.tsx, ProtectedRoute.tsx, Redux store, authSlice, hooks.'

Search codebase for 'Locate components to verify features: FileManager.tsx, SystemPromptManager.tsx, UserManager.tsx, KnowledgeList.tsx, AddKnowledge.tsx, FileUpload.tsx.'

Thought

Saya akan merangkum fitur frontend yang ada dan menulis README baru yang akurat sesuai isi folder tersebut.

`App.tsx` `Home.tsx` `Login.tsx` `Dashboard.tsx` `ProtectedRoute.tsx` `authSlice.ts` `SystemPromptManager.tsx` `FileManager.tsx` `FileUpload.tsx` `KnowledgeList.tsx` `KnowledgeModal.tsx` `SourceModal.tsx` `Chat.tsx` `utils.ts` `package.json`

Berikut README baru yang merefleksikan fitur aktual di contoh/ :

```
# Knowledge Management System — 
Frontend

Aplikasi frontend untuk mengelola 
knowledge base dan chat AI (RAG), 
dengan autentikasi JWT dan halaman 
yang diproteksi.

## 🚀 Fitur Utama

- Autentikasi & Proteksi Halaman
  - Login dengan JWT, simpan token 
  di `localStorage`
  - Middleware proteksi via 
  komponen `ProtectedRoute`
  - Logout dan verifikasi token 
  otomatis
- Manajemen Knowledge
  - Lihat daftar knowledge dengan 
  pagination, sorting, dan aksi 
  massal
  - Tambah knowledge manual
  - Lihat, edit, dan hapus 
  knowledge (detail melalui modal)
- Chat AI (RAG)
  - Chat dengan AI yang merujuk ke 
  knowledge base
  - Render Markdown, tabel, dan 
  formula matematika (KaTeX)
  - Lihat sumber referensi yang 
  digunakan AI (Source Modal)
- File Management & Upload
  - Upload file (PDF, TXT, CSV, 
  Excel) untuk diproses menjadi 
  knowledge
  - Kelola file yang sudah 
  diunggah: lihat detail, 
  download, dan hapus
  - Tautan file (mis. Cloudinary) 
  tersedia untuk pratinjau/unduh
- System Prompt Manager
  - Buat, lihat, edit system prompt
  - Set aktif/default, reset ke 
  default
- User Management
  - Lihat daftar pengguna, buat, 
  edit, aktif/nonaktif, hapus
- UI & Notifikasi
  - Komponen UI modern (Radix UI + 
  Tailwind CSS)
  - Notifikasi interaktif 
  menggunakan `sonner`

## 🛠️ Tech Stack

- React 19 + TypeScript, Vite
- Tailwind CSS 4, Radix UI, Lucide 
Icons
- React Router v7
- Redux Toolkit + React Redux
- React Markdown, Remark GFM, 
Remark Math, Rehype KaTeX, React 
KaTeX
- Sonner (toast)

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── ui/                     # Komponen UI dasar (Button, Card, Tabs, dll)
│   ├── ProtectedRoute.tsx      # Proteksi akses halaman berdasarkan auth
│   ├── Chat.tsx                # Chat AI (RAG) + render Markdown & KaTeX
│   ├── SourceModal.tsx         # Lihat sumber referensi jawaban AI
│   ├── KnowledgeList.tsx       # Daftar knowledge + aksi massal
│   ├── KnowledgeModal.tsx      # Detail, edit, dan statistik knowledge
│   ├── AddKnowledge.tsx        # Form tambah knowledge manual
│   ├── FileUpload.tsx          # Upload file (PDF, TXT, CSV, Excel)
│   ├── FileManager.tsx         # Kelola file yang diunggah
│   ├── SystemPromptManager.tsx # Kelola system prompts
│   └── UserManager.tsx         # Kelola pengguna
├── pages/
│   ├── Home.tsx                # Halaman landing sederhana
│   ├── Login.tsx               # Form login
│   └── Dashboard.tsx           # Tab navigasi utama fitur
├── store/
│   └── authSlice.ts            # State & aksi autentikasi (login, verify, CRUD user)
├── lib/
│   └── utils.ts                # Util cn dan apiRequest (fetch + Authorization)
├── types/                      # Definisi tipe (auth, knowledge)
├── App.tsx                     # Konfigurasi routing utama
└── main.tsx                    # Entry point + BrowserRouter
```

## 🚀 Quick Start

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd chatbot_cs/contoh
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Buka http://localhost:5173 di browser Anda

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build hasil
npm run preview
```

## 📋 Available Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run lint` - Menjalankan ESLint untuk code quality
- `npm run preview` - Preview hasil build

## 🔧 Konfigurasi

### Environment Variables
```
VITE_BACKEND_BASE_URL=http://localhost:7860
```

### API Integration
Frontend berkomunikasi dengan backend RAG API yang berjalan di:
- Development: `http://localhost:7860` ([FastAPI Backend](https://github.com/arifian853/rag-template-fastapi))
- Production: Sesuaikan dengan deployment backend
