# Entitas & Kunjungan Management System

Aplikasi manajemen Entitas dan Kunjungan berbasis web untuk mengelola data entitas, mencatat aktivitas kunjungan, serta memantau status kunjungan melalui dashboard.

Aplikasi dibangun menggunakan React + TypeScript sebagai frontend dan Laravel sebagai backend REST API. Sistem autentikasi menggunakan Laravel Sanctum untuk melindungi endpoint yang membutuhkan akses pengguna.

## 1. Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Laravel
- PHP
- PostgreSQL
- Laravel Sanctum
- REST API
- Eloquent ORM

## 2. Features

### Authentication
- Registrasi akun pengguna.
- Login menggunakan email dan password.
- Logout.
- Mengambil informasi pengguna yang sedang login.
- Proteksi halaman berdasarkan status autentikasi.

### Dashboard
- Menampilkan jumlah entitas.
- Menampilkan jumlah kunjungan.

### Manajemen Entitas
- Menampilkan seluruh data entitas.
- Menambahkan entitas.
- Mengubah data entitas.
- Menghapus entitas.
- Mencegah duplikasi entitas berdasarkan kombinasi nama dan tipe.
- Pencarian entitas berdasarkan nama.
- Filter berdasarkan segmentasi.

### Manajemen Kunjungan
- Menampilkan data kunjungan pengguna.
- Menambahkan kunjungan.
- Mengubah data kunjungan.
- Mengubah status penyelesaian kunjungan.
- Menghapus kunjungan.
- Pencarian dan filtering berdasarkan:
  - Status kunjungan.
  - Nama entitas.
  - Tanggal mulai.
  - Tanggal akhir.
  - Tipe entitas.
  - Segmentasi.
  - Wilayah.

## 3. Project Structure

Frontend dan backend dikelola secara terpisah.

```text
project/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── .env.example
│   └── composer.json
│
└── README.md
```

*Struktur di atas merupakan gambaran pemisahan frontend dan backend. Sesuaikan dengan struktur repository sebenarnya.*

## 4. Requirements

Pastikan perangkat sudah memiliki:

- Node.js dan npm.
- PHP sesuai kebutuhan versi Laravel.
- Composer.
- PostgreSQL.
- Git.
- Ekstensi PHP `pdo_pgsql` untuk koneksi PostgreSQL.

## 5. Installation & Setup

### 5.1. Clone Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

## 6. Backend Setup (Laravel)

### 6.1. Masuk ke Folder Backend

```bash
cd backend
```

### 6.2. Install Dependencies

```bash
composer install
```

### 6.3. Environment Configuration

Salin `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

Pada Windows, file dapat disalin secara manual.

Sesuaikan konfigurasi database pada file `.env`.

```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nama_database
DB_USERNAME=postgres
DB_PASSWORD=password_database
```

Buat database terlebih dahulu melalui PostgreSQL atau pgAdmin.

### 6.4. Generate Application Key

```bash
php artisan key:generate
```

### 6.5. Database Migration

Jalankan migrasi untuk membuat seluruh tabel database.

```bash
php artisan migrate
```

Tidak tersedia data seed atau akun demo bawaan. Data dapat dibuat secara langsung melalui aplikasi setelah pengguna melakukan registrasi.

### 6.6. Run Backend Server

```bash
php artisan serve
```

Backend akan berjalan pada:

```text
http://localhost:8000
```

Base URL API:

```text
http://localhost:8000/api
```

## 7. Frontend Setup (React)

### 7.1. Masuk ke Folder Frontend

Buka terminal baru.

```bash
cd frontend
```

### 7.2. Install Dependencies

```bash
npm install
```

### 7.3. API Configuration

Konfigurasi koneksi API diatur melalui file konfigurasi API pada folder `src/api/`.

Sesuaikan base URL dengan alamat backend Laravel yang digunakan.

Contoh:

```typescript
const API_BASE_URL = "http://localhost:8000/api";
```

Pastikan seluruh request API menggunakan base URL tersebut.

### 7.4. Run Frontend Server

```bash
npm run dev
```

Frontend biasanya dapat diakses melalui:

```text
http://localhost:5173
```

Pastikan frontend dan backend berjalan secara bersamaan.

## 8. Authentication & Authorization

Aplikasi menggunakan Laravel Sanctum untuk autentikasi berbasis token.

### Authentication Flow

1. Pengguna melakukan registrasi.
2. Pengguna melakukan login menggunakan email dan password.
3. Backend memvalidasi kredensial pengguna.
4. Jika berhasil, backend memberikan access token.
5. Frontend menggunakan token untuk mengakses protected API.
6. Pengguna dapat mengakses halaman aplikasi setelah autentikasi berhasil.
7. Ketika logout, token autentikasi dihapus dari backend.

### Protected Routes

Halaman internal aplikasi hanya dapat diakses oleh pengguna yang sudah login.

Jika pengguna belum terautentikasi dan mencoba mengakses halaman internal secara langsung melalui URL, aplikasi akan mengarahkan pengguna ke halaman login.

Backend juga melindungi endpoint menggunakan middleware:

```php
Route::middleware('auth:sanctum')->group(function() {
    // Protected API endpoints
});
```

Setiap request ke protected API harus menyertakan header:

```http
Authorization: Bearer {access_token}
Accept: application/json
```

Proteksi dilakukan pada dua sisi:

- Frontend: Membatasi akses halaman berdasarkan status autentikasi.
- Backend: Memvalidasi token sebelum memproses request.

## 9. API Overview

Base URL:

```text
http://localhost:8000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register pengguna |
| POST | `/login` | Login pengguna |
| POST | `/logout` | Logout pengguna |
| GET | `/me` | Informasi pengguna |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/countEntitas` | Jumlah entitas |
| GET | `/countKunjungan` | Jumlah kunjungan |

### Entitas

| Method | Endpoint | Description |
|---|---|---|
| GET | `/entitas` | Menampilkan entitas |
| POST | `/entitas` | Menambahkan entitas |
| GET | `/entitas/{id}` | Detail entitas (belum diimplementasikan) |
| PUT/PATCH | `/entitas/{id}` | Memperbarui entitas |
| DELETE | `/entitas/{id}` | Menghapus entitas |

### Kunjungan

| Method | Endpoint | Description |
|---|---|---|
| GET | `/kunjungan` | Menampilkan kunjungan |
| POST | `/kunjungan` | Menambahkan kunjungan |
| PUT | `/kunjungan/{id}` | Memperbarui kunjungan |
| PUT | `/kunjungan/{id}/status` | Memperbarui status |
| DELETE | `/kunjungan/{id}` | Menghapus kunjungan |
| GET | `/kunjungan/search` | Pencarian dan filtering |

Seluruh endpoint selain register dan login membutuhkan autentikasi.

## 10. Search & Filtering

Endpoint pencarian kunjungan:

```http
GET /api/kunjungan/search
```

Parameter yang tersedia:

| Parameter | Type | Description |
|---|---|---|
| status | Boolean | Filter status kunjungan |
| tanggal_mulai | Date | Filter tanggal mulai |
| tanggal_akhir | Date | Filter tanggal akhir |
| name | String | Pencarian nama entitas |
| type | String | Parameter tipe entitas |
| segment | String | Filter segmentasi entitas |
| region | String | Parameter wilayah entitas |

Contoh pencarian berdasarkan status:

```http
GET /api/kunjungan/search?status=1
```

Contoh pencarian berdasarkan nama:

```http
GET /api/kunjungan/search?name=PT%20ABC
```

Contoh pencarian berdasarkan segmentasi:

```http
GET /api/kunjungan/search?segment=B2B
```

Contoh pencarian berdasarkan rentang tanggal:

```http
GET /api/kunjungan/search?tanggal_mulai=2026-11-01&tanggal_akhir=2026-11-30
```

Contoh kombinasi beberapa filter:

```http
GET /api/kunjungan/search?status=1&name=PT%20ABC&segment=B2B&tanggal_mulai=2026-11-01&tanggal_akhir=2026-11-30
```

Catatan: Parameter `type` dan `region` sudah menerima validasi request, tetapi belum diterapkan pada query pencarian backend. Filter yang benar-benar diterapkan adalah status, tanggal mulai, tanggal akhir, nama, dan segment.

## 11. Technical Decisions

### Frontend

**React + TypeScript**

Digunakan untuk membangun antarmuka aplikasi berbasis komponen. TypeScript membantu menjaga konsistensi tipe data dan mengurangi kesalahan selama pengembangan.

**Tailwind CSS**

Digunakan untuk styling antarmuka dengan pendekatan utility-first agar pengembangan UI lebih konsisten dan responsif.

**React Router**

Digunakan untuk mengelola navigasi halaman dan proteksi halaman berdasarkan status autentikasi.

**Axios**

Digunakan sebagai HTTP client untuk komunikasi antara frontend dan backend REST API.

### Backend

**Laravel REST API**

Laravel digunakan untuk menangani business logic, validasi request, pengelolaan database, dan penyediaan endpoint API.

**Laravel Sanctum**

Dipilih untuk autentikasi API menggunakan personal access token.

**PostgreSQL**

Digunakan sebagai relational database untuk menyimpan data pengguna, entitas, dan kunjungan. PostgreSQL mendukung integritas data melalui primary key, foreign key, dan constraint.

**Eloquent ORM**

Digunakan untuk mengelola interaksi database dan relasi antar-model.

### Database Relationship

Relasi database yang digunakan:

- Satu entitas dapat memiliki banyak kunjungan.
- Setiap kunjungan terhubung dengan satu entitas.
- Setiap kunjungan menyimpan ID pengguna yang membuatnya.

## 12. AI Usage & Development Process

AI digunakan sebagai alat bantu selama proses pengembangan aplikasi, dengan cakupan penggunaan yang berbeda pada frontend dan backend.

### Frontend

AI digunakan pada hampir seluruh bagian pengembangan frontend, antara lain:

- Pembuatan dan pengembangan komponen UI.
- Implementasi halaman aplikasi.
- Styling menggunakan Tailwind CSS.
- Implementasi form dan interaksi pengguna.
- Integrasi frontend dengan REST API.
- Implementasi fitur CRUD.
- Penanganan response dan error dari API.
- Pengembangan tampilan responsif.

Namun, terdapat dua bagian yang dikerjakan tanpa bantuan AI:

- `App.tsx`, termasuk pengaturan utama aplikasi dan routing.
- Perancangan struktur folder frontend.

### Backend

Pengembangan backend sebagian besar dilakukan tanpa bantuan AI.

AI hanya digunakan sebagai alat bantu pada pembuatan function `search` di `KunjunganController`, khususnya untuk membantu implementasi logika pencarian dan filtering data kunjungan.

Bagian backend lainnya dikembangkan secara mandiri.

### AI as a Development Assistant

Penggunaan AI ditujukan untuk membantu mempercepat proses pengembangan, memberikan referensi implementasi, dan membantu penyelesaian masalah teknis. Hasil implementasi tetap perlu diperiksa dan disesuaikan dengan kebutuhan aplikasi.

## 13. Testing

Pengujian dilakukan secara manual melalui antarmuka aplikasi dan Postman.

Belum tersedia automated test suite khusus pada repository ini.

### 13.1. Authentication Testing

| Scenario | Expected Result |
|---|---|
| Registrasi dengan data valid | Akun berhasil dibuat |
| Registrasi dengan email yang sudah digunakan | Registrasi ditolak |
| Login dengan kredensial benar | Login berhasil dan token diberikan |
| Login dengan password salah | Login ditolak |
| Akses halaman internal tanpa login | Dialihkan ke halaman login |
| Akses protected API tanpa token | Request ditolak |
| Logout | Token saat ini dihapus |

### 13.2. Entitas Testing

| Scenario | Expected Result |
|---|---|
| Menambahkan entitas baru | Data berhasil ditambahkan |
| Menambahkan entitas duplikat | Data ditolak |
| Mengubah data entitas | Data berhasil diperbarui |
| Menghapus entitas | Data berhasil dihapus |
| Mencari nama entitas | Data sesuai pencarian ditampilkan |
| Filter segmentasi B2B/B2C | Data sesuai segmentasi ditampilkan |

### 13.3. Kunjungan Testing

| Scenario | Expected Result |
|---|---|
| Menambahkan kunjungan | Data berhasil ditambahkan |
| Menambahkan kunjungan dengan entitas tidak valid | Request ditolak |
| Mengubah tanggal kunjungan | Data berhasil diperbarui |
| Mengubah status kunjungan | Status berhasil diperbarui |
| Menghapus kunjungan | Data berhasil dihapus |
| Filter status kunjungan | Data sesuai status ditampilkan |
| Filter tanggal mulai dan akhir | Data sesuai rentang tanggal ditampilkan |
| Pencarian nama entitas | Data sesuai pencarian ditampilkan |
| Kombinasi beberapa filter | Data sesuai seluruh filter yang diterapkan ditampilkan |

Pengujian dapat dilakukan secara langsung melalui aplikasi setelah registrasi atau menggunakan Postman dengan access token yang diperoleh dari proses login.

## 14. Demo Account & Sample Data

Tidak tersedia akun demo maupun data seed bawaan.

Untuk mencoba aplikasi:

1. Jalankan frontend dan backend.
2. Buka halaman aplikasi.
3. Pilih menu Register.
4. Buat akun menggunakan nama, email, dan password.
5. Login menggunakan akun yang telah dibuat.
6. Tambahkan data entitas melalui halaman Entitas.
7. Tambahkan data kunjungan melalui halaman Kunjungan.
8. Coba fitur pencarian, filtering, perubahan status, dan penghapusan data.

Seluruh data yang dibuat selama pengujian disimpan pada database PostgreSQL yang telah dikonfigurasi.

## 15. Known Limitations

Beberapa batasan yang diketahui pada implementasi saat ini:

- Belum tersedia data seed atau dummy data bawaan.
- Belum tersedia akun demo khusus.
- Pengujian masih dilakukan secara manual dan belum memiliki automated test suite.
- Dashboard saat ini menampilkan jumlah keseluruhan entitas dan kunjungan.
- Filter pencarian `type` dan `region` sudah menerima validasi request, tetapi belum diterapkan pada query pencarian backend.
- Relasi Eloquent antara User dan Kunjungan belum didefinisikan.
- Beberapa endpoint detail pada resource entitas belum diimplementasikan.
- Pengelolaan hak akses data kunjungan berdasarkan kepemilikan masih perlu disempurnakan pada operasi update, update status, dan delete.
- Constraint unique pada kolom `type` di database belum sepenuhnya sesuai dengan pemeriksaan duplikasi kombinasi `name` dan `type`.

## 16. Future Improvements

Pengembangan selanjutnya dapat mencakup:

- Automated testing untuk API dan business logic.
- Implementasi pagination pada data entitas dan kunjungan.
- Penyempurnaan authorization berdasarkan kepemilikan data.
- Penyempurnaan filter pencarian entitas.
- Penambahan data seed untuk kebutuhan development.
- Penyempurnaan validasi dan konsistensi response API.
- Implementasi fitur detail entitas.

---

**Project:** Entitas & Kunjungan Management System  
**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Laravel REST API  
**Authentication:** Laravel Sanctum  
**Database:** PostgreSQL