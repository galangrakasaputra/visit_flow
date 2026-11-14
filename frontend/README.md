# Frontend - Management System

Aplikasi frontend Management System yang dibangun menggunakan React dan TypeScript. Aplikasi ini digunakan untuk mengelola data Entitas dan Kunjungan melalui integrasi REST API.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Lucide React
- Fetch API

---

## 1. Struktur Folder

Struktur folder utama aplikasi:

```text
src/
│
├── api/
│   ├── ApiClient.ts
│   ├── AuthApi.ts
│   ├── HomeApi.ts
│   ├── Entitas.ts
│   └── Kunjungan.ts
│
├── components/
│   └── ...
│
├── layouts/
│   └── DashboardLayout.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── Entitas.tsx
│   └── Kunjungan.tsx
│
├── utils/
│   └── AuthStorage.ts
│
├── App.tsx
└── main.tsx
```

### Penjelasan Struktur Folder

| Folder/File | Fungsi |
|---|---|
| `api/` | Menyimpan fungsi komunikasi dengan REST API. |
| `components/` | Menyimpan komponen UI yang dapat digunakan kembali. |
| `layouts/` | Menyimpan layout utama aplikasi. |
| `pages/` | Menyimpan halaman aplikasi. |
| `utils/` | Menyimpan fungsi utilitas, seperti pengelolaan token. |
| `App.tsx` | Mengatur routing dan proteksi halaman. |
| `main.tsx` | Entry point aplikasi React. |

---

## 2. Pengelolaan API

Seluruh fungsi komunikasi API diletakkan di dalam folder:

```text
src/api/
```

Setiap halaman menggunakan fungsi API dari file yang sesuai. Dengan demikian, proses request tidak perlu ditulis berulang kali di dalam komponen halaman.

### 2.1 ApiClient.ts

File:

```text
src/api/ApiClient.ts
```

Merupakan pusat pengelolaan HTTP request.

Tanggung jawab:
- Menentukan base URL API.
- Mengirim request menggunakan Fetch API.
- Mengatur header request.
- Menambahkan Bearer Token.
- Mengambil dan memproses response JSON.
- Menangani error response.
- Mengarahkan pengguna ke halaman Login jika sesi berakhir (HTTP 401).

Contoh konfigurasi base URL:

```typescript
const API_BASE_URL = "http://127.0.0.1:8000/api";
```

Contoh penggunaan:

```typescript
const response = await apiRequest("/entitas");
```

Contoh request POST:

```typescript
const response = await apiRequest("/entitas", {
  method: "POST",
  body: JSON.stringify(payload),
});
```

Seluruh modul API menggunakan `apiRequest()` agar konfigurasi request tetap konsisten.

### 2.2 AuthApi.ts

File:

```text
src/api/AuthApi.ts
```

Digunakan untuk komunikasi autentikasi.

Tanggung jawab:
- Mengirim data login.
- Memproses response autentikasi.
- Mengelola proses login pengguna.

### 2.3 HomeApi.ts

File:

```text
src/api/HomeApi.ts
```

Digunakan untuk mengambil data dashboard.

Data yang ditampilkan:
- Jumlah Entitas.
- Jumlah Kunjungan.

### 2.4 Entitas.ts

File:

```text
src/api/Entitas.ts
```

Digunakan untuk komunikasi API yang berkaitan dengan Entitas.

Fungsi:
- `getEntitas()` — mengambil daftar entitas.
- `createEntitas()` — menambahkan entitas.
- `updateEntitas()` — memperbarui entitas.
- `deleteEntitas()` — menghapus entitas.

Struktur data Entitas:

```typescript
type Entitas = {
  id: number;
  name: string;
  type: string;
  segment: string;
  region: string;
};
```

Ketentuan segment:
- B2B
- B2C

### 2.5 Kunjungan.ts

File:

```text
src/api/Kunjungan.ts
```

Digunakan untuk komunikasi API yang berkaitan dengan Kunjungan.

Fungsi:
- `getKunjungan()` — mengambil daftar kunjungan.
- `createKunjungan()` — menambahkan kunjungan.
- `updateKunjungan()` — memperbarui data kunjungan.
- `updateStatusKunjungan()` — memperbarui status kunjungan.
- `deleteKunjungan()` — menghapus kunjungan.

Struktur data Kunjungan:

```typescript
type Kunjungan = {
  id: number;
  entitas_id: number;
  user_id: number;
  visit_date: string;
  status: boolean;
  entitas: {
    id: number;
    name: string;
    type: string;
    segment: string;
    region: string;
  };
};
```

Ketentuan status:
- `true` = Sudah Dikunjungi.
- `false` = Belum Dikunjungi.

---

## 3. Autentikasi dan Pengelolaan Token

Pengelolaan token berada di:

```text
src/utils/AuthStorage.ts
```

File ini digunakan untuk mengelola token autentikasi pengguna.

Fungsi yang digunakan:
- `getToken()` — mengambil token.
- `setToken()` — menyimpan token.
- `removeToken()` — menghapus token.

Token digunakan oleh `ApiClient.ts` untuk autentikasi request menggunakan header:

```http
Authorization: Bearer {token}
```

### Proteksi Halaman

Halaman utama aplikasi hanya dapat diakses setelah pengguna berhasil login.

Halaman yang membutuhkan autentikasi:
- Home
- Entitas
- Kunjungan

Jika sesi login berakhir atau API memberikan response HTTP 401, token akan dihapus dan pengguna diarahkan kembali ke halaman Login.

---

## 4. Routing

Pengaturan routing berada di:

```text
src/App.tsx
```

Daftar halaman:

| Halaman | Path | Keterangan |
|---|---|---|
| Login | `/login` | Halaman autentikasi pengguna. |
| Home | `/` | Dashboard aplikasi. |
| Entitas | `/entitas` | Pengelolaan data entitas. |
| Kunjungan | `/kunjungan` | Pengelolaan data kunjungan. |

Halaman Home, Entitas, dan Kunjungan dilindungi oleh autentikasi.

---

## 5. Layout dan Komponen

### DashboardLayout.tsx

File:

```text
src/layouts/DashboardLayout.tsx
```

Digunakan sebagai layout utama halaman setelah pengguna login.

Fitur:
- Sidebar navigasi.
- Menu Home.
- Menu Entitas.
- Menu Kunjungan.
- Tombol Logout.
- Sidebar responsif untuk perangkat mobile.

### Components

Folder:

```text
src/components/
```

Digunakan untuk menyimpan komponen UI yang digunakan kembali oleh beberapa halaman.

Komponen yang bersifat khusus untuk satu halaman dapat tetap diletakkan di dalam file halaman tersebut.

---

## 6. Fitur Halaman

### 6.1 Login

Fitur:
- Form login.
- Mengirim kredensial melalui Auth API.
- Menyimpan token setelah autentikasi berhasil.
- Mengarahkan pengguna ke halaman Home setelah login.

### 6.2 Home / Dashboard

Menampilkan ringkasan data:
- Total Entitas.
- Total Kunjungan.

Data diperoleh melalui fungsi API pada `HomeApi.ts`.

### 6.3 Entitas

Halaman untuk mengelola data entitas.

Fitur:
- Menampilkan daftar entitas.
- Menambahkan entitas.
- Mengedit entitas.
- Menghapus entitas.
- Pencarian berdasarkan nama.
- Filter berdasarkan segment.
- Notifikasi keberhasilan atau kegagalan operasi.

Ketentuan segment:
- B2B
- B2C

### 6.4 Kunjungan

Halaman untuk mengelola data kunjungan.

Data ditampilkan menggunakan card.

Informasi setiap card:
- Nama entitas.
- Tipe entitas.
- Segment.
- Region.
- Tanggal kunjungan.
- Status kunjungan.

Fitur:
- Menampilkan daftar kunjungan.
- Menambahkan kunjungan.
- Mengedit kunjungan.
- Menghapus kunjungan.
- Mengubah status melalui checkbox.
- Pencarian berdasarkan nama entitas.
- Filter berdasarkan segment.
- Filter berdasarkan status.
- Filter berdasarkan rentang tanggal.

Ketentuan form:
1. Pengguna memilih segment terlebih dahulu.
2. Dropdown entitas menyesuaikan segment yang dipilih.
3. Pengguna memilih tanggal kunjungan.

Filter dapat digunakan secara bersamaan.

---

## 7. Notifikasi

Operasi yang dilakukan pengguna memberikan notifikasi sebagai umpan balik.

Notifikasi digunakan untuk:
- Login berhasil atau gagal.
- Penambahan data berhasil atau gagal.
- Perubahan data berhasil atau gagal.
- Penghapusan data berhasil atau gagal.
- Perubahan status kunjungan berhasil atau gagal.
- Penanganan error API.

---

## 8. Responsive Design

Aplikasi dirancang agar dapat digunakan pada berbagai ukuran layar.

Penyesuaian tampilan:
- Desktop: sidebar dan konten utama.
- Tablet: layout menyesuaikan lebar layar.
- Mobile: sidebar dapat dibuka dan ditutup.
- Card dan form menyesuaikan ukuran perangkat.

Styling menggunakan Tailwind CSS.

---

## 9. Menjalankan Project

Pastikan Node.js dan npm sudah terpasang.

Clone repository:

```bash
git clone <repository-url>
```

Masuk ke direktori project:

```bash
cd <project-folder>
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Aplikasi dapat diakses melalui alamat lokal yang ditampilkan oleh Vite di terminal.

Untuk membuat build production:

```bash
npm run build
```

Untuk menjalankan pemeriksaan TypeScript dan build sesuai konfigurasi project, gunakan script yang tersedia di `package.json`.

---

## 10. Konfigurasi API

Base URL backend diatur melalui file:

```text
src/api/ApiClient.ts
```

Contoh:

```typescript
const API_BASE_URL = "http://127.0.0.1:8000/api";
```

Jika alamat API berubah, cukup sesuaikan konfigurasi tersebut tanpa perlu mengubah URL pada setiap halaman.

Dokumentasi endpoint, controller, database, dan konfigurasi backend dikelola secara terpisah pada dokumentasi backend.

---

## Catatan Pengembangan

Beberapa prinsip yang digunakan dalam pengembangan frontend:

1. Pisahkan komunikasi API dari tampilan halaman.
2. Gunakan `ApiClient.ts` untuk request HTTP.
3. Gunakan TypeScript untuk mendefinisikan tipe data.
4. Gunakan komponen bersama jika dibutuhkan oleh beberapa halaman.
5. Gunakan Tailwind CSS untuk styling.
6. Pastikan halaman tetap responsif pada desktop, tablet, dan mobile.
7. Pastikan halaman internal hanya dapat diakses oleh pengguna yang sudah login.
8. Tangani response error API agar pengguna mendapatkan informasi yang jelas.