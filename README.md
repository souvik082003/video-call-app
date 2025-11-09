# 🎥 Video Call India

A simple and fast **video calling web app** built using **React**, **WebRTC**, and **Socket.io**.  
It allows users to create or join rooms, make peer-to-peer video calls, and share screens — all right from the browser.

🌐 **Live Demo:** [https://video-call-india.netlify.app](https://video-call-india.netlify.app)  
💻 **GitHub Repo:** [https://github.com/souvik082003/video-call-app](https://github.com/souvik082003/video-call-app)

---

## ✨ Features

- 🔗 Create and join video rooms instantly  
- 🎙️ Enable / disable camera and microphone  
- 🖥️ Screen sharing support  
- 💬 Real-time signaling via Socket.io  
- 📱 Responsive UI for mobile and desktop  
- 🔒 Peer-to-peer encrypted media streams (no data stored on server)

---

## 🧰 Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | React + WebRTC |
| Signaling | Node.js + Socket.io |
| Backend Hosting | Render / Railway / Heroku |
| Frontend Hosting | Netlify |
| Styling | CSS / Tailwind (if used) |

---

## ⚙️ Getting Started Locally

Follow these steps to run the app on your system.

### 1. Clone this repository
```bash
git clone https://github.com/souvik082003/video-call-app.git
cd video-call-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory and add:

```bash
REACT_APP_SIGNALING_URL=https://your-signaling-server.example.com
REACT_APP_STUN_URL=stun:stun.l.google.com:19302

# Optional TURN configuration for NAT traversal
REACT_APP_TURN_URL=turn:turn.example.com:3478
REACT_APP_TURN_USER=turnuser
REACT_APP_TURN_PASS=turnpassword
```

> You can also check `.env.example` for reference.

### 4. Start the app
```bash
npm start
```

The app will run on:  
`http://localhost:3000`

---

## 🚀 Deployment

### Frontend (React)
1. Build production files:
   ```bash
   npm run build
   ```
2. Deploy the `build/` folder on **Netlify**, **Vercel**, or any static host.

### Backend (Signaling Server)
If you’re using a custom signaling server:
- Deploy it on Render, Railway, or Heroku.
- Make sure your frontend `.env` has the correct backend URL.

---

## 🧠 How It Works

1. Each user joins a room with a unique ID.  
2. Socket.io handles signaling between peers (offer, answer, and ICE candidates).  
3. WebRTC establishes a **peer-to-peer** connection for audio and video.  
4. TURN/STUN servers help connect users behind NAT firewalls.  

---

## 🧩 Commands

| Command | Description |
|----------|-------------|
| `npm start` | Start the development server |
| `npm run build` | Build for production |
| `npm test` | Run tests (if any) |
| `npm run lint` | Lint code for formatting issues |

---

## 🧾 Example `.env.example`

```bash
# Signaling Server
REACT_APP_SIGNALING_URL=https://your-signal-server.example.com

# STUN/TURN Configuration
REACT_APP_STUN_URL=stun:stun.l.google.com:19302
REACT_APP_TURN_URL=turn:turn.example.com:3478
REACT_APP_TURN_USER=turnuser
REACT_APP_TURN_PASS=turnpassword

# Optional features
REACT_APP_ENABLE_SCREENSHARE=true
```

---

## 🔧 Troubleshooting

| Problem | Possible Fix |
|----------|---------------|
| ❌ Camera not showing | Allow camera permission in browser |
| 🔇 No sound | Check microphone access |
| ⚠️ Cannot connect | Check your signaling server URL and CORS settings |
| 🕸️ Connection drops | Use a TURN server for better NAT handling |

---

## 🔒 Privacy & Security

- No video or audio data is stored on the server.  
- All media streams are end-to-end encrypted by WebRTC.  
- Use HTTPS and secure TURN credentials in production.  

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to improve the UI, fix bugs, or add new features:

1. Fork this repo  
2. Create a branch: `feature/your-feature`  
3. Commit your changes  
4. Open a Pull Request  

Please keep PRs small and focused.

---

## 🪪 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and share it with proper credit.

---

## 📬 Contact

**Developer:** Souvik  
📧 Email: work03.souvik@gmail.com  
🔗 GitHub: [souvik082003](https://github.com/souvik082003)

---
