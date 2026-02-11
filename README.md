# 🌾 The Villagers

**The Villagers** is a full-stack cultural preservation platform that empowers people to share stories, food recipes, specialties, and photos from their villages.

The platform groups communities using **pincode-based identification** to avoid spelling inconsistencies in village names and to ensure structured data organization.

---

## ✨ Features

### 📖 Stories
- Share village stories
- Book-style reading interface
- Fullscreen animated story view
- Pincode-based filtering

### 📸 Photos
- Upload village landscapes & architecture
- Automatic village detection via pincode
- Category-based classification
- Instant UI updates after upload

### 🍲 Food
- Add traditional dishes
- Ingredients & recipe support
- Village auto-detection
- Cultural preservation focus

### 🌿 Specialties
- Highlight unique village products
- Share traditional practices

---

## 🧠 Core Concepts

- **Pincode-based grouping** instead of manual village name entry
- Clean UI inspired by modern social platforms
- Cultural-first design approach
- Backend-driven structured data

---

## 🏗 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- TanStack Query

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL (Supabase)

---

## 📦 Project Structure

~~~
The-Villagers/
│
├── frontend/
│ ├── src/pages/
│ ├── src/components/
│ └── ...
│
├── backend/
│ ├── src/routes/
│ ├── prisma/schema.prisma
│ └── ...

~~~


---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```bash
git clone https://github.com/abiraisingh/the-villagers.git
cd the-villagers
```
### 2️⃣ Backend Setup
```
cd backend
npm install
```
### Create .env file:
```
DATABASE_URL="your_postgresql_connection_string"
```
### Run migrations:
```
npx prisma migrate dev
npx prisma generate
npm run dev
```
### Server runs on:
```
http://localhost:4000
```
### 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```
### App runs on:
```
http://localhost:8080
```
## 📌 API Endpoints

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| GET    | `/api/pincodes/:code` | Fetch villages by pincode |
| GET    | `/api/stories`        | Fetch all stories         |
| POST   | `/api/stories`        | Create story              |
| GET    | `/api/photos`         | Fetch photos              |
| POST   | `/api/photos`         | Upload photo              |
| POST   | `/api/foods`          | Add food dish             |


## 🎯 Vision

The Villagers aims to:

Digitally preserve rural culture

Bridge rural & urban communities

Create structured cultural archives

Empower villages through storytelling

## 🔮 Future Improvements

Mobile App (React Native / Expo)

AI-powered translation

Village profile pages

Moderation & admin panel

Likes & comments

Geo-location auto detection

Media optimization & cloud storage

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

## 📜 License
MIT License

## 👤 Author
Built with ❤️ to preserve village culture.

