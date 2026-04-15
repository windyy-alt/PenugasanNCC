# Laporan Penugasan Docker — NCC Open Recruitment 2026

---

## 1. Deskripsi Singkat Service

Service yang dibuat adalah **ncc-service**, sebuah REST API sederhana menggunakan **Node.js** dan framework **Express**. Service ini dirancang ringan dan efisien, dengan tujuan utama menyediakan endpoint `/health` untuk health check, serta endpoint `/` sebagai landing info service.

**Stack:**
- Runtime: Node.js 20 (Alpine)
- Framework: Express 4
- Container: Docker (multi-stage build)

---

## 2. Penjelasan Endpoint `/health`

Endpoint `/health` dapat diakses melalui:

```
GET /health
```

**Response (200 OK):**

```json
{
  "status": "ok",
  "service": "ncc-service",
  "uptime": 42.5,
  "timestamp": "2026-04-14T10:00:00.000Z"
}
```

- `status`: Selalu bernilai `"ok"` jika service berjalan normal.
- `service`: Nama service, dikonfigurasi via environment variable `SERVICE_NAME`.
- `uptime`: Waktu (detik) sejak service berjalan.
- `timestamp`: Waktu saat request diterima dalam format ISO 8601.

---

## 3. Penjelasan Proses Build dan Run Docker

### Struktur Proyek

```
.
├── src/
│   └── index.js          # Source code utama
├── .dockerignore          # File yang dikecualikan dari build context
├── .env                   # Environment variables
├── docker-compose.yml     # Konfigurasi Docker Compose
├── Dockerfile             # Instruksi build image
└── package.json           # Dependency Node.js
```

### Dockerfile (Multi-Stage Build)

Dockerfile menggunakan **multi-stage build** untuk menghasilkan image sekecil mungkin:

- **Stage 1 (builder):** Install production dependencies dengan `npm ci`.
- **Stage 2 (runner):** Hanya menyalin `node_modules` hasil install + source code. Tidak membawa tool build yang tidak perlu.

Hasilnya: image final hanya berisi yang dibutuhkan untuk menjalankan aplikasi.

**Optimasi yang diterapkan:**
| Fitur | Keterangan |
|---|---|
| Base image `node:20-alpine` | Image Alpine jauh lebih ringan (~50MB vs ~350MB full) |
| Multi-stage build | Memisahkan fase build dan runtime |
| Non-root user | Keamanan — service tidak berjalan sebagai root |
| `HEALTHCHECK` instruction | Docker otomatis memantau kesehatan container |
| `.dockerignore` | Mengurangi ukuran build context |
| `restart: unless-stopped` | Container otomatis restart jika crash |
| `.env` + `ENV` | Konfigurasi fleksibel via environment variable |

### Cara Build & Run

**Menggunakan Docker Compose (direkomendasikan):**

```bash
# Build dan jalankan
docker compose up -d

# Cek status
docker compose ps

# Lihat log
docker compose logs -f
```

**Menggunakan Docker langsung:**

```bash
# Build image
docker build -t ncc-service .

# Jalankan container
docker run -d \
  --name ncc-service \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  ncc-service
```

**Verifikasi health check:**

```bash
curl http://localhost:3000/health
```

---

## 4. Penjelasan Proses Deployment ke VPS

### Prasyarat

- VPS dengan OS Linux (Ubuntu/Debian/CentOS)
- Docker & Docker Compose terinstall
- Port 3000 (atau yang dipilih) dibuka di firewall/security group

### Langkah Deployment

**1. Transfer file ke VPS**

```bash
# Menggunakan scp
scp -r ./ncc-service user@IP_VPS:~/ncc-service

# Atau clone dari Git repository
git clone <repo-url> ncc-service
```

**2. SSH ke VPS**

```bash
ssh user@IP_VPS
cd ncc-service
```

**3. Jalankan service**

```bash
docker compose up -d
```

**4. Verifikasi akses publik**

```bash
curl http://IP_VPS:3000/health
```

Response yang diharapkan:

```json
{
  "status": "ok",
  "service": "ncc-service",
  "uptime": 5.2,
  "timestamp": "2026-04-14T10:00:00.000Z"
}
```

---

## 5. Screenshot / Bukti Endpoint

> *(Tambahkan screenshot hasil `curl` atau browser ke endpoint `/health` setelah deployment ke VPS di sini)*

Contoh output terminal:

```
$ curl http://<IP_VPS>:3000/health
{"status":"ok","service":"ncc-service","uptime":128.4,"timestamp":"2026-04-14T10:05:22.000Z"}
```

---

## 6. Kendala yang Dihadapi

> *(Isi dengan kendala yang kamu temui selama proses pengerjaan, jika ada)*

Tidak ada kendala signifikan. Beberapa catatan:
- Pastikan port 3000 tidak bentrok dengan service lain di VPS.
- Jika VPS menggunakan firewall `ufw`, jalankan `ufw allow 3000` sebelum testing.

---

## Checklist Fitur

### Wajib
- [x] Membuat service sederhana (Node.js + Express)
- [x] Endpoint `/health` tersedia
- [x] Endpoint `/health` mengembalikan 200 OK
- [x] Service dijalankan menggunakan Docker

### Opsional (Poin Plus)
- [x] Multi-stage build pada Dockerfile
- [x] Optimasi image dengan base image Alpine
- [x] Instruction `HEALTHCHECK` pada Dockerfile
- [x] Docker Compose untuk menjalankan service
- [x] Environment variable via `.env` dan `ENV`
- [x] `.dockerignore` untuk optimasi build context
- [x] Restart policy (`unless-stopped`) pada container
- [x] Port configuration yang rapi dan jelas
- [x] Struktur Dockerfile yang clean dan best practice
