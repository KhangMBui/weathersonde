# 🌦️ WeatherSonde

A cross-platform mobile app for real-time weather balloon (sonde) data visualization and logging.  
Built with **Expo + React Native** for the frontend, and **Python (FastAPI)** for the backend.

---

## 🚀 Features

- 📡 **Live Data**: View real-time telemetry from your weather sonde.
- 🗺️ **Map Tracking**: See the sonde’s location on an interactive map.
- 📊 **Historical Records**: Browse and analyze past weather data.
- 🔌 **USB Integration**: Backend reads data directly from USB-connected sensors.
- ⚡ **Offline-Ready**: Works on local WiFi—no internet required.

---

## 📦 Project Structure

```
weathersonde/
├── Backend/      # Python FastAPI server (USB/serial data reader)
├── Frontend/     # Expo React Native app (mobile/web)
└── README.md     # You are here!
```

---

## 🛠️ Quick Start

### 1. Backend (Python)

```bash
cd Backend
pip install -r requirements.txt
python main.py
```

### 2. Frontend (Expo)

```bash
cd Frontend
npm install
npx expo start
```

- Scan the QR code with **Expo Go** or your custom dev client.

---

## ⚙️ Configuration

- Set your backend URL in `Frontend/app.json` under:

  ```json
  "extra": {
    "BACKEND_URL": "http://your-backend-ip:8000"
  }
  ```

- For local/offline use, connect both devices to the same WiFi or hotspot.

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

---

## 🛰️ Made with ❤️ by Khang

```
🌦️  |  📡  |  🗺️  |  📊  |  🔌
```
