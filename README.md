# spk-bansos-web
Frontend Sistem Pendukung Keputusan Penerima Bansos metode SAW: kelola kriteria, data calon penerima, penilaian, dan hasil perankingan. Dibangun dengan React (Vite).

## Menjalankan (development)
Jalankan API (`spk-bansos-api`) terlebih dahulu, lalu:
```bash
npm install
npm run dev      # http://localhost:5173 (request /api diteruskan ke http://localhost:3000)
```

## Build
```bash
npm run build
```
Image Docker dibangun lewat `docker-compose.yml` di repo `spk-bansos-api`.
