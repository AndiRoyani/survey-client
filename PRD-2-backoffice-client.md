# PRD 2 — Backoffice Client Portal

## 1. Overview

Portal web yang digunakan oleh client untuk membuat dan mengelola project survey, memantau progress pekerjaan secara real-time, serta melihat dan mengunduh hasil survey yang telah disetujui.

---

## 2. Hierarki Data

```
Project
└── Job (kumpulan task, di-assign ke 1 field worker)
    └── Task (1 produk di 1 toko — foto produk + catat harga)
```

**Contoh:**
- Client mendaftarkan Toko Maju Jaya dengan 3 produk (Susu UHT, Bayam, Wortel)
- → Sistem membuat 3 task: [Susu UHT @ Toko Maju Jaya], [Bayam @ Toko Maju Jaya], [Wortel @ Toko Maju Jaya]
- Task-task tersebut bisa masuk ke job (field worker) yang berbeda
- Total task project = jumlah toko × jumlah produk per toko

---

## 3. Target Pengguna

- Perusahaan atau individu yang memesan jasa survey harga pasar
- Role di sisi client: **Client Admin** (bisa buat project) dan **Client Viewer** (hanya pantau)
- Akses via browser desktop / laptop

---

## 4. Alur Utama

```
Login → Dashboard → Buat Project baru
      → Input daftar toko & daftar produk per toko
      → Sistem otomatis hitung total task (toko × produk)
      → Submit project ke admin internal → Tunggu konfirmasi
      → Admin internal kelompokkan task menjadi job & assign ke field worker
      → Pantau progress per task
      → Hasil survey muncul setelah admin approve
      → Download laporan
```

---

## 5. Modul & Fitur

### 5.1 Autentikasi
- Login menggunakan email + password
- Tidak ada registrasi mandiri (akun dibuat oleh admin internal)
- Lupa password → reset via email
- Logout

### 5.2 Dashboard
- Summary card:
  - Total project aktif
  - Total project selesai
  - Total task selesai (approved) bulan ini
  - Total task masih berjalan
- Grafik progress project terbaru (% task selesai)
- Tabel project terbaru dengan status

### 5.3 Manajemen Project

#### List Project
- Tabel semua project milik client ini
- Kolom: nama project, tanggal dibuat, deadline, status, progress task (X/Y selesai)
- Filter: status, tanggal
- Search berdasarkan nama project
- Tombol buat project baru

#### Status Project
| Status | Keterangan |
|---|---|
| `draft` | Baru dibuat, belum disubmit ke admin |
| `pending_review` | Sudah disubmit, menunggu konfirmasi admin internal |
| `active` | Admin sudah konfirmasi, job & task sedang berjalan |
| `completed` | Semua job approved |
| `cancelled` | Project dibatalkan |

#### Buat Project Baru

**Step 1 — Info Project**
- Nama project
- Deskripsi / tujuan survey
- Deadline
- Catatan tambahan untuk surveyor

**Step 2 — Daftar Produk (master)**
Daftar produk yang ingin disurvey, berlaku sebagai referensi untuk semua toko:
- Nama produk
- Kategori (wajib — contoh: Sayuran, Susu, Minuman, Bumbu, Daging, Buah)
- Instruksi foto / catatan khusus per produk (opsional)

**Step 3 — Daftar Toko**
Per toko, client input:
- Nama toko
- Alamat
- Kota / area
- **Pilih produk mana yang ada di toko ini** (checklist dari daftar produk di Step 2)
- Catatan khusus per toko (opsional)

> Setiap kombinasi toko × produk yang dipilih = 1 task.
> Sistem menampilkan preview: "Total task yang akan dibuat: X task dari Y toko"

**Step 4 — Review & Submit**
- Ringkasan: jumlah toko, jumlah produk, total task
- Tabel preview task per toko
- Tombol **Simpan sebagai Draft** atau **Submit ke Admin**

#### Edit Project
- Hanya bisa edit jika status masih `draft`
- Setelah `pending_review` atau `active`, data terkunci (hanya bisa lihat)

#### Detail Project
- Semua info project
- Tab **Overview**: total toko, total produk, total task, progress keseluruhan
- Tab **Task**: tabel semua task (filter per toko, per produk, per kategori, per status)
- Tab **Hasil Survey**: muncul setelah ada task yang approved
- Tab **Riwayat**: log perubahan status project

### 5.4 Monitor Progress

#### Summary
- Total task: X
- Selesai (approved): X
- Sedang dikerjakan: X
- Belum dimulai: X
- Perlu revisi: X
- Progress bar keseluruhan project

#### Tabel Task
Kolom: nama toko, nama produk, kategori, status, tanggal selesai
- Filter: toko, produk, kategori, status
- Client **tidak bisa** melihat nama field worker (privasi internal)
- Bisa group by toko → tampilkan semua produk per toko

### 5.5 Hasil Survey

- Hanya menampilkan task yang sudah berstatus `approved`
- Tampilan bisa dipilih:
  - **View per Toko**: expand toko → tampil semua produk & hasilnya
  - **View per Produk**: expand produk → tampil semua toko & hasilnya
- Per task:
  - Foto produk / harga (gallery)
  - Harga yang tercatat
  - Catatan surveyor (jika ada)
  - Tanggal & waktu pengambilan data
- Filter: toko, produk, kategori, tanggal

#### Download Laporan
- **Export Excel (semua task approved)**:
  - Sheet 1: ringkasan — baris = toko, kolom = produk, isi = harga
  - Sheet 2: detail lengkap — setiap task satu baris, ada kolom link foto
- **Export per toko**: laporan satu toko saja
- **Export per produk**: laporan satu produk di semua toko
- **Download Foto ZIP** — per job atau per toko

### 5.6 Notifikasi
| Event | Notifikasi |
|---|---|
| Project dikonfirmasi admin | "Project [nama] sudah aktif dan mulai dikerjakan" |
| Project selesai | "Semua task di project [nama] telah selesai" |
| Progress mencapai 50% / 100% | "Project [nama] sudah X% selesai" |

### 5.7 Pengaturan Akun
- Lihat & edit profil perusahaan (nama, kontak)
- Kelola user di akun client (tambah/hapus viewer)
- Ganti password
- Logout

---

## 6. Aturan Bisnis

1. Client hanya bisa melihat data project milik perusahaannya sendiri
2. Total task = jumlah kombinasi toko × produk yang dipilih client
3. Tidak semua produk harus ada di semua toko — client pilih per toko
4. Client tidak bisa assign job, itu hak admin internal
5. Client tidak bisa melihat nama / identitas field worker
6. Client hanya bisa melihat hasil task yang sudah di-approve admin
7. Project hanya bisa diedit selama status masih `draft`

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
| Grafik | Recharts |
| Export Excel (mock) | SheetJS (xlsx) |

---

## 8. Fase Pengembangan

### Fase 1 — Frontend (Sekarang)
- [ ] Setup project React + shadcn/ui + Tailwind
- [ ] Halaman login (UI only, dummy auth)
- [ ] Dashboard summary (UI dengan mock data)
- [ ] List & detail project
- [ ] Form buat project multi-step: info → produk → toko (checklist produk per toko) → review
- [ ] Preview total task sebelum submit
- [ ] Monitor progress task (tabel + filter per toko / produk / kategori)
- [ ] Halaman hasil survey: view per toko & per produk
- [ ] Export Excel (mock / static data)
- [ ] Pengaturan akun (UI only)

### Fase 2 — Integrasi Backend
- [ ] Koneksi API: auth, project, task, hasil survey
- [ ] Download foto ZIP
- [ ] Notifikasi in-app & email
- [ ] Multi-user per akun client (admin + viewer)
- [ ] Visualisasi data: grafik harga per produk per toko
