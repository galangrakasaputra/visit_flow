# Laravel Backend API

Backend aplikasi manajemen Entitas dan Kunjungan menggunakan Laravel REST API dengan Laravel Sanctum sebagai sistem autentikasi.

## 1. Teknologi

- Framework: Laravel
- Authentication: Laravel Sanctum
- Database: MySQL
- Architecture: REST API
- API Prefix: `/api`

## 2. Struktur Folder

```text
app/
├── Http/
│   └── Controllers/
│       ├── AuthController.php
│       ├── EntitasController.php
│       └── KunjunganController.php
│
└── Models/
    ├── User.php
    ├── Entitas.php
    └── Kunjungan.php

database/
└── migrations/
    ├── xxxx_create_users_table.php
    ├── xxxx_create_entitas_table.php
    └── xxxx_create_kunjungan_table.php

routes/
└── api.php
```

## 3. Database

Aplikasi menggunakan tiga tabel utama, yaitu `users`, `entitas`, dan `kunjungan`.

### 3.1. Tabel Users

Tabel `users` digunakan untuk menyimpan informasi pengguna dan autentikasi.

| Kolom | Keterangan |
|---|---|
| id | Primary key |
| name | Nama pengguna |
| email | Email pengguna |
| password | Password yang telah di-hash |
| remember_token | Token untuk fitur remember me |
| email_verified_at | Waktu verifikasi email |
| created_at | Waktu data dibuat |
| updated_at | Waktu data diperbarui |

Menggunakan struktur tabel bawaan Laravel.

### 3.2. Tabel Entitas

Tabel `entitas` digunakan untuk menyimpan informasi entitas.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| id | BIGINT | Primary key, auto increment |
| name | VARCHAR | Nama entitas |
| type | VARCHAR | Tipe entitas, unique |
| segment | VARCHAR | Segmentasi entitas |
| region | VARCHAR | Wilayah entitas |
| created_at | TIMESTAMP | Waktu data dibuat |
| updated_at | TIMESTAMP | Waktu data diperbarui |

**Ketentuan:**
- `type` memiliki constraint unique pada database.
- `name` menyimpan nama entitas.
- `segment` menyimpan segmentasi entitas, seperti B2B dan B2C.
- `region` menyimpan wilayah entitas.

### 3.3. Tabel Kunjungan

Tabel `kunjungan` digunakan untuk mencatat aktivitas kunjungan pengguna terhadap entitas.

| Kolom | Tipe Data | Keterangan |
|---|---|---|
| id | BIGINT | Primary key |
| entitas_id | BIGINT | Foreign key ke tabel entitas |
| user_id | BIGINT | Foreign key ke tabel users |
| visit_date | DATE | Tanggal kunjungan |
| status | BOOLEAN | Status penyelesaian kunjungan |
| created_at | TIMESTAMP | Waktu data dibuat |
| updated_at | TIMESTAMP | Waktu data diperbarui |

**Relasi database:**
- `entitas_id` mengarah ke `entitas.id`.
- `user_id` mengarah ke `users.id`.
- Penghapusan entitas akan menghapus seluruh kunjungan terkait.
- Penghapusan pengguna akan menghapus seluruh kunjungan terkait.

**Status Kunjungan:**

| Value | Keterangan |
|---|---|
| 0 / false | Belum selesai |
| 1 / true | Selesai |

## 4. Model dan Relasi

Aplikasi menggunakan tiga model utama.

### 4.1. User Model

File: `app/Models/User.php`

Digunakan untuk mengelola data pengguna dan autentikasi.

**Konfigurasi:**
- `HasApiTokens`: Mengaktifkan autentikasi token Laravel Sanctum.
- `HasFactory`: Mendukung penggunaan model factory.
- `Notifiable`: Mendukung fitur notifikasi.
- `Fillable`: Mengizinkan mass assignment untuk name, email, dan password.
- `Hidden`: Menyembunyikan password dan remember_token dari serialisasi model.

**Casts:**
- `email_verified_at`: datetime.
- `password`: hashed.

### 4.2. Entitas Model

File: `app/Models/Entitas.php`

Digunakan untuk mengelola data entitas.

**Fillable:**

| Field | Keterangan |
|---|---|
| name | Nama entitas |
| type | Tipe entitas |
| segment | Segmentasi entitas |
| region | Wilayah entitas |

**Relasi:**

Satu entitas dapat memiliki banyak kunjungan (One-to-Many).

```php
public function kunjungan()
{
    return $this->hasMany(Kunjungan::class, 'entitas_id');
}
```

### 4.3. Kunjungan Model

File: `app/Models/Kunjungan.php`

Digunakan untuk mengelola data kunjungan.

**Fillable:**

| Field | Keterangan |
|---|---|
| entitas_id | ID entitas |
| user_id | ID pengguna |
| visit_date | Tanggal kunjungan |
| status | Status kunjungan |

**Relasi:**

Setiap kunjungan dimiliki oleh satu entitas (Many-to-One).

```php
public function entitas()
{
    return $this->belongsTo(Entitas::class, 'entitas_id');
}
```

**Catatan:** Kolom `user_id` sudah tersedia pada tabel kunjungan, tetapi relasi Eloquent ke model User belum didefinisikan.

## 5. Controller

Aplikasi menggunakan tiga controller utama.

### 5.1. AuthController

File: `app/Http/Controllers/AuthController.php`

Menangani seluruh proses autentikasi pengguna menggunakan Laravel Sanctum.

| Method | Fungsi |
|---|---|
| `register()` | Mendaftarkan pengguna baru |
| `login()` | Memvalidasi kredensial dan membuat token autentikasi |
| `logout()` | Menghapus token yang sedang digunakan |
| `me()` | Mengambil informasi pengguna yang sedang login |

**Register:**

Validasi:
- name: required, string, maksimal 255 karakter.
- email: required, string, format email.
- password: required, string, minimal 8 karakter.

Sebelum membuat akun, sistem memeriksa apakah email sudah digunakan.

**Login:**

Validasi:
- email: required, string, format email.
- password: required, string.

Jika autentikasi berhasil, sistem menghasilkan access token menggunakan Sanctum.

**Logout:**

Menghapus current access token pengguna.

**Me:**

Mengembalikan informasi pengguna yang sedang terautentikasi.

### 5.2. EntitasController

File: `app/Http/Controllers/EntitasController.php`

Menangani pengelolaan data entitas.

| Method | Fungsi |
|---|---|
| `index()` | Mengambil seluruh data entitas |
| `store()` | Menambahkan entitas baru |
| `update()` | Memperbarui data entitas |
| `destroy()` | Menghapus data entitas |
| `countEntitas()` | Menghitung jumlah seluruh entitas |
| `create()` | Belum diimplementasikan |
| `show()` | Belum diimplementasikan |
| `edit()` | Belum diimplementasikan |

**Validasi Entitas:**

| Field | Aturan |
|---|---|
| name | required, string, max:255 |
| type | required, string |
| segment | required, string |
| region | required, string |

**Pemeriksaan Duplikasi:**

Sebelum menambahkan entitas, sistem memeriksa kombinasi nama dan tipe entitas.

```php
$exist = Entitas::where('name', $validate['name'])
    ->where('type', $validate['type'])
    ->exists();
```

Jika kombinasi nama dan tipe sudah ditemukan, sistem mengembalikan pesan bahwa entitas sudah ada.

**Update Entitas:**

Sistem mencari entitas berdasarkan ID. Jika tidak ditemukan, proses pembaruan dihentikan. Jika ditemukan, sistem memvalidasi data dan memeriksa duplikasi sebelum memperbarui data.

**Delete Entitas:**

Menghapus data entitas berdasarkan ID. Data kunjungan terkait juga akan terhapus karena menggunakan foreign key dengan cascade.

### 5.3. KunjunganController

File: `app/Http/Controllers/KunjunganController.php`

Menangani seluruh proses pengelolaan kunjungan.

| Method | Fungsi |
|---|---|
| `dataKunjungan()` | Mengambil kunjungan milik pengguna yang sedang login |
| `store()` | Menambahkan kunjungan baru |
| `update()` | Memperbarui data kunjungan |
| `updateStatus()` | Memperbarui status kunjungan |
| `search()` | Mencari dan memfilter data kunjungan |
| `countKunjungan()` | Menghitung jumlah seluruh kunjungan |
| `delete()` | Menghapus data kunjungan |

**Data Kunjungan:**

Mengambil data kunjungan berdasarkan `user_id` pengguna yang sedang login.

Data entitas juga disertakan menggunakan Eloquent eager loading:

```php
Kunjungan::where('user_id', $user->id)
    ->with('entitas')
    ->get();
```

**Tambah Kunjungan:**

Validasi:

| Field | Aturan |
|---|---|
| entitas_id | required, exists:entitas,id |
| visit_date | required, date |

`user_id` diambil secara otomatis dari pengguna yang sedang login.

**Update Kunjungan:**

Validasi:

| Field | Aturan |
|---|---|
| entitas_id | required, exists:entitas,id |
| visit_date | required, date |
| status | required, boolean |

**Update Status:**

Digunakan untuk mengubah status penyelesaian kunjungan tanpa harus memperbarui seluruh data kunjungan.

Validasi:
- status: required, boolean.

**Search Kunjungan:**

Digunakan untuk melakukan pencarian dan filtering berdasarkan beberapa parameter sekaligus.

Parameter yang diterapkan dalam query:

- Status kunjungan.
- Tanggal mulai.
- Tanggal akhir.
- Nama entitas.
- Segmentasi entitas.

Pencarian nama entitas menggunakan `LOWER()` agar pencarian tidak membedakan huruf besar dan kecil.

**Delete Kunjungan:**

Menghapus data kunjungan berdasarkan ID.

## 6. API Routes

Seluruh endpoint didefinisikan langsung di:

```text
routes/api.php
```

Base URL:

```text
http://localhost:8000/api
```

### 6.1. Authentication

Endpoint autentikasi yang dapat diakses tanpa token:

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/register` | Registrasi pengguna |
| POST | `/login` | Login pengguna |

Endpoint autentikasi yang membutuhkan token:

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/logout` | Logout pengguna |
| GET | `/me` | Informasi pengguna |

### 6.2. Dashboard

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/countEntitas` | Menghitung jumlah entitas |
| GET | `/countKunjungan` | Menghitung jumlah kunjungan |

Kedua endpoint mengembalikan jumlah keseluruhan data, bukan hanya data milik pengguna tertentu.

### 6.3. Entitas

Menggunakan Laravel Resource Controller.

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/entitas` | Mengambil seluruh entitas |
| POST | `/entitas` | Menambahkan entitas |
| GET | `/entitas/{id}` | Detail entitas (belum diimplementasikan) |
| PUT/PATCH | `/entitas/{id}` | Memperbarui entitas |
| DELETE | `/entitas/{id}` | Menghapus entitas |

### 6.4. Kunjungan

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/kunjungan` | Mengambil data kunjungan |
| POST | `/kunjungan` | Menambahkan kunjungan |
| PUT | `/kunjungan/{id}` | Memperbarui kunjungan |
| PUT | `/kunjungan/{id}/status` | Memperbarui status kunjungan |
| DELETE | `/kunjungan/{id}` | Menghapus kunjungan |
| GET | `/kunjungan/search` | Pencarian dan filtering kunjungan |

## 7. Parameter Search Kunjungan

Endpoint:

```http
GET /api/kunjungan/search
```

Parameter yang tersedia:

| Parameter | Tipe | Keterangan |
|---|---|---|
| status | Boolean | Filter status kunjungan |
| tanggal_mulai | Date | Filter tanggal mulai |
| tanggal_akhir | Date | Filter tanggal akhir |
| name | String | Pencarian nama entitas |
| type | String | Parameter tipe entitas |
| segment | String | Filter segmentasi entitas |
| region | String | Parameter wilayah entitas |

**Contoh pencarian:**

Berdasarkan status:

```http
GET /api/kunjungan/search?status=1
```

Berdasarkan nama entitas:

```http
GET /api/kunjungan/search?name=PT%20ABC
```

Berdasarkan segmentasi:

```http
GET /api/kunjungan/search?segment=B2B
```

Berdasarkan rentang tanggal:

```http
GET /api/kunjungan/search?tanggal_mulai=2026-11-01&tanggal_akhir=2026-11-30
```

Kombinasi beberapa filter:

```http
GET /api/kunjungan/search?status=1&name=PT%20ABC&segment=B2B&tanggal_mulai=2026-11-01&tanggal_akhir=2026-11-30
```

**Catatan implementasi:** Walaupun `type` dan `region` sudah divalidasi pada controller, keduanya belum digunakan untuk menyaring query. Filter yang benar-benar diterapkan saat ini adalah status, tanggal mulai, tanggal akhir, nama, dan segment.

## 8. Format Response API

### 8.1. Response Berhasil

Contoh response login:

```json
{
    "message": "Berhasil Login",
    "access_token": "TOKEN",
    "token_type": "Bearer",
    "status": "success"
}
```

Contoh response pengambilan data:

```json
{
    "data": [],
    "status": "success"
}
```

### 8.2. Response Gagal

Contoh response email sudah digunakan:

```json
{
    "message": "Email Sudah Dipakai",
    "status": "error"
}
```

Contoh response data tidak ditemukan:

```json
{
    "message": "Entitas Tidak Ada",
    "status": "error"
}
```

### 8.3. Validasi

Jika validasi Laravel gagal, API akan mengembalikan response JSON berisi pesan kesalahan validasi dengan HTTP status 422.

## 9. Autentikasi API

Aplikasi menggunakan Laravel Sanctum untuk mengamankan endpoint.

Setelah login berhasil, API menghasilkan token yang harus digunakan untuk mengakses protected endpoint.

Tambahkan header berikut pada setiap request yang membutuhkan autentikasi:

```http
Authorization: Bearer {access_token}
Accept: application/json
```

Token diperoleh melalui endpoint:

```http
POST /api/login
```

## 10. Menjalankan Project

### 10.1. Install Dependency

```bash
composer install
```

### 10.2. Konfigurasi Environment

Salin `.env.example` menjadi `.env` dan sesuaikan konfigurasi database.

```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database
DB_USERNAME=root
DB_PASSWORD=
```

### 10.3. Generate Application Key

```bash
php artisan key:generate
```

### 10.4. Migrasi Database

```bash
php artisan migrate
```

### 10.5. Menjalankan Server

```bash
php artisan serve
```

API dapat diakses melalui:

```text
http://localhost:8000/api
```

## 11. Testing API

Pengujian dapat dilakukan menggunakan Postman.

Urutan pengujian:

1. Register pengguna.
2. Login untuk mendapatkan access token.
3. Simpan token untuk request berikutnya.
4. Uji endpoint `/me`.
5. Uji CRUD entitas.
6. Uji CRUD kunjungan.
7. Uji pencarian dan filtering kunjungan.
8. Uji perubahan status kunjungan.
9. Uji logout.

Untuk protected endpoint, gunakan Authorization Type: Bearer Token dan masukkan access token yang diperoleh saat login.

## 12. Catatan Pengembangan

- Semua endpoint API didefinisikan di `routes/api.php`.
- Autentikasi menggunakan Laravel Sanctum.
- Data kunjungan pada endpoint `/kunjungan` dibatasi berdasarkan pengguna yang sedang login.
- Data kunjungan baru otomatis menggunakan ID pengguna yang sedang login.
- Dashboard menghitung jumlah seluruh entitas dan kunjungan.
- Penghapusan entitas menghapus data kunjungan terkait.
- Search mendukung kombinasi beberapa parameter filter.
- Dokumentasi ini hanya mencakup backend Laravel dan tidak membahas implementasi frontend.
