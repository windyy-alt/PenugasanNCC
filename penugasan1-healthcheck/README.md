# Penugasan 1 Docker - Health Check

---

## 1. Deskripsi Singkat Service

Service yang dibuat adalah **health check**, sebuah REST API sederhana menggunakan **Node.js** dan framework **Express**. Service ini dirancang ringan dan efisien, dengan tujuan utama menyediakan endpoint `/health` untuk health check, serta endpoint `/` sebagai landing.

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
  "service": "health-check",
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
