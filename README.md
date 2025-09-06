# Welcome GJNET 🌐

Sistem manajemen pelanggan dan pembayaran untuk penyedia layanan internet lokal berbasis web — dibangun menggunakan **Next.js**, **Tailwind CSS**, dan **Turso (libSQL)**.

---

## 🚀 Fitur Utama

- ✅ **Dashboard Admin**: Kelola pengguna, pelanggan, dan pembayaran.
- 👨‍💼 **Login Customer**: Pelanggan dapat masuk untuk melihat status langganan mereka.
- 💰 **Manajemen Pembayaran**: Tambah/edit/hapus pembayaran dengan ekspor PDF & Excel.
- 🔐 **Autentikasi Role-Based**: Admin, readonly, dan customer.
- 🎨 **Tema GJNET**: Tampilan modern dengan nuansa biru teknologi.
- 📅 **Form Kalender**: Input tanggal dengan date picker (dd-mm-yyyy).

---

## 📁 Struktur Folder

```
pages/
├── api/              # API backend (Next.js API routes)
│   └── customers/
│   └── payments/
├── customer/         # Halaman login dan dashboard pelanggan
│   └── customer-login.js
│   └── customer-dashboard.js
├── dashboard.js      # Dashboard utama admin
├── login.js          # Login admin
├── payments/         # Halaman manajemen pembayaran
│   └── index.js
└── users.js          # Halaman manajemen user/admin
```

---

## ⚙️ Instalasi

```bash
# Clone project
git clone https://github.com/namamu/gjnet.git
cd gjnet

# Install dependencies
npm install

# Jalankan secara lokal
npm run dev
```

---

## 🧠 Teknologi yang Digunakan

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Turso / libSQL](https://turso.tech/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [xlsx](https://github.com/SheetJS/sheetjs)
- [react-datepicker](https://github.com/Hacker0x01/react-datepicker)

---

## 🧪 Akun Uji Coba

**Admin**  
👤 Username: `admin`  
🔑 Password: `admin123`

**Customer**  
👤 Email: `pelanggan@example.com`  
🔑 Password: `rahasia123`

*(Ubah di database sesuai kebutuhan)*

---

## 📝 Lisensi

Proyek ini bersifat open-source dan bebas digunakan untuk pengembangan internal.

---

## 👨‍💻 Dibuat oleh

Tim Developer GJNET  
📧 support@gjnet.local  
🌐 www.gjnet.local _(fiktif, ganti sesuai domain kamu)_