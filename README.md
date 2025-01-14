# Stok Yönetim Uygulaması

Modern ve kullanıcı dostu bir stok yönetim uygulaması. React, TypeScript, Material-UI ve Node.js teknolojileri kullanılarak geliştirilmiştir.

## Özellikler

### Ürün Yönetimi

- Ürün ekleme, düzenleme ve silme
- Ürün durumu yönetimi (Yayında/Taslak)
- Ürün stok takibi
- Hızlı stok güncelleme
- Ürün detay görüntüleme
- Ürün arama ve filtreleme

### Market Sayfası

- Yayında olan ürünlerin listelenmesi
- Ürün kartları ile görsel sunum
- Sepete ürün ekleme/çıkarma
- Sepet yönetimi (LocalStorage ile)
- Miktar güncelleme
- Toplam fiyat hesaplama

### Kullanıcı Arayüzü

- Responsive tasarım
- Koyu/Açık tema desteği
- Mobil uyumlu sidebar
- Kullanıcı dostu arayüz
- Modal ve hover efektleri

## Kurulum

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd stock-management
npm install
npm run dev
```

### Frontend Build Mode

```bash
cd stock-management
npm install
npm run build
npm run preview
```

## API Endpoints

### Ürün Yönetimi

- `GET /products` - Tüm ürünleri listele
- `POST /add-product` - Yeni ürün ekle
- `PUT /products/:id` - Ürün güncelle
- `DELETE /products/:id` - Ürün sil
- `PUT /products/:id/toggle-status` - Ürün durumunu değiştir

## Teknoloji Stack

### Frontend

- React
- TypeScript
- Material-UI
- React Router
- Redux Toolkit
- Zod (Form validasyonu)
- Vite

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

## Geliştirme Prensipleri

- TypeScript ile tip güvenliği
- Redux ile merkezi state yönetimi
- Material-UI ile tutarlı tasarım
- React Router ile sayfa yönetimi
- LocalStorage ile sepet verisi yönetimi
- Responsive tasarım prensiplerine uygunluk

## Özellik Detayları

### Ürün İşlemleri

- Ürün ekleme formu validasyonu
- Zorunlu alanların belirtilmesi (\*)
- Fiyat kontrolü (0'dan büyük olmalı)
- Sayı inputlardaki mouse wheel ile input change kapatıldı 
- Sayı inputlardaki ok tuşları kaldırıldı
- Resim URL desteği
- Birim ve kategori seçimi

### Market Özellikleri

- Sadece yayında olan ürünlerin gösterimi
- Sepet verilerinin kalıcı saklanması (localstorage ile)
- Ürün miktarı kontrolü
- Anlık fiyat hesaplaması
- Kolay miktar güncelleme

### Tema ve Görünüm

- Sistem genelinde tutarlı tema
- Koyu/Açık mod geçişi
- Responsive layout
- Mobil uyumlu menü
