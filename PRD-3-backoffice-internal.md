# PRD 3 — Backoffice Internal Perusahaan

## 1. Overview

Platform web untuk tim internal dalam mengelola seluruh operasional: konfirmasi project dari client, pengelompokan task menjadi job, distribusi job ke field worker, review hasil survey, hingga pengelolaan pembayaran field worker.

---

## 2. Hierarki Data

```
Project
└── Job (kumpulan task, di-assign ke 1 field worker)
    └── Task (1 produk di 1 toko — foto produk + catat harga)
```

**Contoh:**
- Project "Survey Pasar Mei 2025":
  - 50 toko × rata-rata 3 produk per toko = **150 task**
  - Admin set: 1 job = 30 task → **5 job** terbentuk
  - Task dari toko yang sama boleh masuk ke job (field worker) yang berbeda
  - Admin set maks kategori per job = 2 → sistem kelompokkan task berdasarkan kategori produk

---

## 3. Target Pengguna & Role

| Role | Akses |
|---|---|
| **Superadmin** | Akses penuh ke semua modul |
| **Admin** | Kelola project, buat & kelola job/task, assign field worker, kelola akun client & FW |
| **Supervisor** | Monitor progress, review & approve/reject hasil survey |
| **Finance** | Kelola data pembayaran field worker |

---

## 4. Alur Utama

```
Client submit project (daftar toko + produk per toko)
  → Sistem buat task otomatis (1 task = 1 produk × 1 toko)
  → Admin konfirmasi project
  → Admin set jumlah task per job & maks kategori per job
  → Sistem generate saran distribusi task ke job berbasis kategori
  → Admin review & override manual jika perlu
  → Admin assign tiap job ke field worker
  → Field worker kerjakan task satu per satu (via Flutter app)
  → Field worker submit job setelah semua task selesai
  → Supervisor review → Approve / Reject
  → Jika reject → Field worker revisi task bermasalah → Submit ulang
  → Jika approve → Data tersedia untuk client
  → Finance catat & proses pembayaran FW
```

---

## 5. Modul & Fitur

### 5.1 Autentikasi & Manajemen Akses
- Login email + password
- Tidak ada registrasi publik
- Manajemen role per user (Superadmin only)
- Reset password user
- Audit log login
- Logout & paksa logout (Superadmin)

### 5.2 Dashboard

#### Overview
- Total project aktif
- Total task: breakdown per status (unassigned, in_progress, submitted, approved, rejected)
- Total job: breakdown per status
- Field worker aktif hari ini
- Project mendekati deadline (≤ 3 hari)

#### Per Role
- **Admin**: fokus job unassigned & project pending konfirmasi
- **Supervisor**: fokus job submitted (antrian review)
- **Finance**: ringkasan pembayaran bulan ini

---

### 5.3 Manajemen Client
> Akses: Superadmin, Admin

- List semua client (nama, kontak, jumlah project, status akun)
- Tambah client baru:
  - Nama perusahaan / individu
  - Email & nomor HP
  - Buat akun login client portal (email + password awal)
  - Set role client: Admin atau Viewer
- Edit data client
- Nonaktifkan / aktifkan akun client
- Lihat history project per client

---

### 5.4 Manajemen Project
> Akses: Superadmin, Admin

#### List Project
- Filter: status, client, tanggal, deadline
- Search nama project
- Kolom: nama, client, tanggal dibuat, deadline, status, progress task (X/Y)

#### Konfirmasi Project dari Client
- List project dengan status `pending_review`
- Buka detail → review isi project:
  - Daftar toko
  - Daftar produk per toko beserta kategorinya
  - Total task yang akan dibuat (preview: X toko × Y produk = Z task)
  - Instruksi & catatan dari client
- Tombol **Konfirmasi** → status menjadi `active`, task otomatis terbuat (1 per kombinasi toko × produk)
- Tombol **Tolak / Minta Revisi** → kirim catatan ke client, status kembali ke `draft`

#### Buat Project Manual
- Admin bisa buat project langsung tanpa melalui client portal
- Form multi-step sama seperti di client portal + pilih client yang terhubung

#### Detail Project
- Info lengkap project
- Tab **Job & Task**: list semua job beserta task di dalamnya
- Tab **Task Pool**: semua task dalam project (filter per toko, produk, kategori, status, job)
- Tab **Progress**: summary status semua job dan task
- Tab **Hasil**: semua data survey yang sudah approved
- Tab **Log**: riwayat perubahan status

---

### 5.5 Manajemen Job & Task
> Akses: Superadmin, Admin

#### Konsep Task
- Task dibuat otomatis saat project dikonfirmasi
- **1 task = 1 produk di 1 toko**
- Satu toko bisa menghasilkan banyak task (sebanyak produk yang dipilih di toko tersebut)
- Task dari toko yang sama bisa masuk ke job yang berbeda
- Setiap task memiliki atribut: nama produk, kategori produk, nama toko, alamat toko, koordinat GPS toko

#### Pengaturan Job dalam Project
Setelah project dikonfirmasi dan task terbuat:

1. Buka detail project → klik **Kelola Job**
2. Sistem tampilkan: total task yang belum terdistribusi
3. Set **jumlah task per job** (misal: 30) → sistem hitung: `150 ÷ 30 = 5 job`
4. Set **maksimal kategori per job** (pilihan: 1, 2, atau 3)
5. Klik **Generate Saran Distribusi** → sistem jalankan algoritma

#### Algoritma Distribusi Berbasis Kategori
Sistem mengelompokkan task dengan urutan prioritas:

1. **Identifikasi kategori** tiap task (dari kategori produknya)
2. **Kelompokkan task** yang berkategori serupa ke job yang sama
3. **Batasi variasi kategori** per job sesuai setting (maks 1–3)
4. **Seimbangkan jumlah task** antar job agar merata
5. **Flag task sisa** yang tidak bisa dikelompokkan rapi → admin putuskan manual

**Contoh hasil (150 task, maks 2 kategori per job):**
```
Job 1 (30 task) → Sayuran, Buah       — dari 18 toko berbeda
Job 2 (30 task) → Susu, Minuman       — dari 15 toko berbeda
Job 3 (30 task) → Sayuran, Buah       — dari 17 toko berbeda
Job 4 (30 task) → Bumbu, Rempah       — dari 20 toko berbeda
Job 5 (30 task) → Susu, Daging        — dari 14 toko berbeda
```

> Catatan: task dari toko yang sama bisa tersebar ke job berbeda jika kategori produknya berbeda.

#### Tampilan Hasil Saran Distribusi
- Tabel per job: nomor job, kategori di dalamnya, jumlah task, daftar task (expandable)
- Badge warna per kategori untuk visualisasi komposisi tiap job
- Task yang "bermasalah" di-highlight
- Tombol **Terima Semua** atau masuk ke mode **Edit Manual**

#### Override Manual
- Pindahkan task dari satu job ke job lain (select + move atau drag & drop)
- Gabung / pecah job
- Sistem tampilkan peringatan (non-blocking) jika job melebihi batas kategori

#### Tambah Task Manual
- Admin bisa tambah task baru (produk baru di toko tertentu)
- Input: pilih toko (dari daftar toko di project), pilih produk, kategori, instruksi foto
- Task masuk ke pool unassigned → bisa dimasukkan ke job yang ada

#### Assign Job ke Field Worker
- Pilih job yang statusnya `unassigned`
- Pilih field worker (hanya yang `active`)
- Lihat beban kerja field worker: jumlah job & task aktif saat ini
- Konfirmasi assign → status job → `assigned`, FW dapat notifikasi push
- Admin bisa re-assign jika FW belum mulai mengerjakan

#### Monitor Job & Task
Tabel job dengan filter: status, field worker, project, deadline, kategori

| Kolom | Keterangan |
|---|---|
| Nomor Job | ID job dalam project |
| Project | Nama project |
| Kategori | Kategori dominan dalam job |
| Field Worker | Yang di-assign |
| Task Selesai | X / Y task |
| Status Job | assigned / in_progress / submitted / approved / rejected |
| Last Update | Terakhir ada aktivitas |
| Deadline | Deadline project |

- Expand job → tampil list task: nama produk, nama toko, status, tanggal selesai
- Tab **Task Pool** → lihat semua task lintas job, filter per toko untuk lihat task dari satu toko tersebar ke job mana saja

---

### 5.6 Review & Approval Hasil Survey
> Akses: Supervisor, Superadmin

#### Antrian Review
- List job dengan status `submitted`
- Urutkan berdasarkan tanggal submit (terlama duluan)
- Info: nama project, field worker, tanggal submit, jumlah task

#### Detail Review
- Per job → per task:
  - Nama produk & kategori
  - Nama & alamat toko
  - Foto yang diupload (gallery / slideshow)
  - Harga yang diinput
  - Catatan field worker
  - Timestamp pengambilan data
  - Koordinat GPS saat survey (bisa dibuka di maps)
- Task dari toko yang sama dalam job ini dikelompokkan bersama untuk kemudahan review
- Progress review: berapa task sudah dicek dari total

#### Keputusan
- **Approve Job**:
  - Status job → `approved`
  - Semua task dalam job tersedia di client portal
  - Field worker mendapat notifikasi
- **Reject Job**:
  - Wajib isi catatan alasan reject
  - Supervisor bisa tandai task mana yang bermasalah (bisa lebih dari satu)
  - Status job → `rejected`
  - Field worker mendapat notifikasi + daftar task yang harus direvisi

---

### 5.7 Manajemen Field Worker
> Akses: Superadmin, Admin

- List field worker (nama, HP, email, status, total task selesai)
- Tambah field worker baru: nama, HP, email, password awal
- Edit, nonaktifkan / aktifkan, reset password
- Detail field worker:
  - Job aktif saat ini (nama project, jumlah task, progress)
  - History job
  - Statistik: total task selesai, approval rate, rata-rata waktu per task

---

### 5.8 Manajemen Pembayaran Field Worker
> Akses: Finance, Superadmin

- Pembayaran dihitung per **task yang approved**
- Rate per task bisa berbeda per project (diset saat konfirmasi project)
- List tagihan per field worker per periode:
  - Kolom: nama FW, jumlah task approved, rate per task, total tagihan, status bayar
- Tandai Sudah Dibayar + input tanggal, metode, nomor referensi
- Export rekap pembayaran ke Excel per periode
- Riwayat semua transaksi pembayaran

---

### 5.9 Laporan & Analitik
> Akses: Superadmin, Admin, Supervisor

#### Laporan Project
- Export Excel hasil survey:
  - Sheet 1: ringkasan — baris = toko, kolom = produk, isi = harga
  - Sheet 2: detail — setiap task satu baris lengkap dengan link foto
- Export ZIP foto per job

#### Laporan Operasional
- Performa field worker: approval rate, rata-rata waktu per task, jumlah reject
- Progress project: % task selesai per kategori
- Laporan reject: produk / toko mana yang paling sering di-reject

---

### 5.10 Pengaturan Sistem
> Akses: Superadmin

- Manajemen user internal (tambah, edit, nonaktifkan, set role)
- Konfigurasi notifikasi (template pesan FCM & email)
- Log aktivitas sistem

---

## 6. Matriks Akses

| Fitur | Superadmin | Admin | Supervisor | Finance |
|---|:---:|:---:|:---:|:---:|
| Manajemen Client | ✅ | ✅ | ❌ | ❌ |
| Konfirmasi Project | ✅ | ✅ | ❌ | ❌ |
| Buat Job & Distribusi Task | ✅ | ✅ | ❌ | ❌ |
| Assign Job ke FW | ✅ | ✅ | ❌ | ❌ |
| Monitor Job & Task | ✅ | ✅ | ✅ | ❌ |
| Review & Approve/Reject | ✅ | ❌ | ✅ | ❌ |
| Manajemen Field Worker | ✅ | ✅ | ❌ | ❌ |
| Pembayaran FW | ✅ | ❌ | ❌ | ✅ |
| Laporan & Export | ✅ | ✅ | ✅ | ✅ |
| Pengaturan Sistem | ✅ | ❌ | ❌ | ❌ |

---

## 7. Tech Stack (Frontend Only)

> Fase ini mencakup frontend saja. Integrasi backend dilakukan di fase berikutnya.

| Komponen | Teknologi |
|---|---|
| Framework | React |
| Language | TypeScript |
| UI Component | shadcn/ui |
| Styling | Tailwind CSS |
| State Management | Zustand / React Context |
| Routing | React Router v6 |
| Form & Validasi | React Hook Form + Zod |
| Tabel & Filter | TanStack Table |
| Drag & Drop (distribusi job) | dnd-kit |
| Grafik & Analitik | Recharts |
| Maps Preview | Google Maps Embed (static) |
| Export Excel (mock) | SheetJS (xlsx) |

---

## 8. Fase Pengembangan

### Fase 1 — Frontend (Sekarang)
- [ ] Setup project React + shadcn/ui + Tailwind
- [ ] Login + layout per role (UI only, dummy auth)
- [ ] Dashboard per role (mock data)
- [ ] Manajemen client (CRUD UI)
- [ ] List & konfirmasi project — preview total task (toko × produk)
- [ ] Buat job: form set jumlah task per job & maks kategori
- [ ] UI generate & review distribusi task berbasis kategori (mock algoritma)
- [ ] Override manual: select + move & drag & drop task antar job
- [ ] Tab Task Pool: lihat semua task lintas job, filter per toko
- [ ] Assign job ke field worker (UI)
- [ ] Monitor job & task (tabel + expand + filter)
- [ ] Antrian review & halaman detail review per task
- [ ] Manajemen field worker (CRUD UI)
- [ ] Export Excel (mock data)

### Fase 2 — Integrasi Backend
- [ ] Koneksi API seluruh modul
- [ ] Algoritma distribusi kategori dijalankan di backend
- [ ] Modul pembayaran field worker
- [ ] Notifikasi email otomatis
- [ ] Audit log lengkap

### Fase 3 — Enhancement
- [ ] Dashboard analytics lanjutan (grafik tren harga per produk)
- [ ] Geofencing validation
- [ ] API webhook untuk integrasi sistem client eksternal
