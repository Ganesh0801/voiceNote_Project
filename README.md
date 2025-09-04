# Voice Notes App

A full-stack voice notes application that allows users to upload audio, generate transcripts and summaries using Google's Gemini AI, and manage notes efficiently.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Features

- Upload audio files and transcribe speech to text using Google Gemini AI
- Generate concise summaries of the transcribed notes
- Edit, delete, and manage voice notes
- Real-time UI feedback with loading indicators and notifications

---

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, Multer, dotenv
- AI: Google Gemini AI SDK
- Frontend: React, Redux Toolkit, Redux-Saga, Material-UI (MUI), Axios, notistack (notifications)
- Others: Nodemon (development), CORS

---

## Setup and Installation

1. **Clone the repository:**
- git clone https://github.com/Ganesh0801/voiceNote_Project.git

2. **Backend Setup:**
- cd backend
- npm init and install require dependencies

3. **Frontend Setup:**
- cd ../frontend
- npx create-react-app@latest app name and install require dependencies

---

## Environment Variables

- Create a `.env` file in the backend root directory with the following:
- PORT=5000
- MONGODB_URI=mongodb+srv://ganeshsbsa08_db_user:JXZWeuRrPr0JLv9e@voicenote.1pa1q5b.mongodb.net/?retryWrites=true&w=majority&appName=VoiceNo
- GEMINI_API_KEY=AIzaSyA2rDXQpIteBww837YCRcaQNYxnuoyFS
- REACT_APP_API_URL=http://localhost:5000


Make sure to replace placeholder values with your actual keys.

---

## API Endpoints

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------|
| POST   | `/notes/create`       | Upload audio and create note    |
| GET    | `/notes/getAll`       | Fetch all notes                 |
| PUT    | `/notes/:id`          | Update note transcript          |
| DELETE | `/notes/:id`          | Delete note                    |
| POST   | `/notes/:id/summarize`| Generate summary for a note     |

*Audio files are uploaded as multipart/form-data with the key `audio`.*

---

## Frontend Usage

- To start the React app:
- cd frontend
- npm start


- The frontend communicates with the backend through the API URL defined in `.env`.

- Features real-time uploading, transcription, summary generation, editing, and deleting notes.

---

## Scripts

### Backend

- `npm run dev` — Run backend in development mode with automatic reload (nodemon).

### Frontend

- `npm start` — Run frontend React app in development mode.
- `npm run build` — Build frontend for production.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Create a pull request

---

## Additional Notes

- Make sure MongoDB server is running and accessible.
- The Google Gemini AI key is needed for transcription and summarization features.
- Uploaded audio files are stored in the backend `/uploads` directory and served statically.

---

