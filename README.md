# 🤖 J.A.R.V.I.S — Neural Voice & Vision Interface

An intelligent, real-time multimodal assistant powered by **ultra-fast LPU inference (Groq)**, **in-browser voice recognition**, **MediaPipe computer vision hand tracking**, and **desktop protocol automation**.

---

## ⚡ Key Capabilities

- **🎙️ Real-Time Voice Interaction**:
  - Low-latency discrete voice cycling (<300ms reflex responses).
  - Built-in speech barge-in and audio cancellation.
  - Conversational memory and British cinematic persona.

- **🖐️ Vision & Hand Gesture Control**:
  - Real-time hand landmark tracking and fingertip distance detection.
  - Custom gesture triggers (V-Sign, pinch click, index pointing).
  - Face biometric telemetry with status HUD.

- **💬 Quick WhatsApp Protocol Dispatch**:
  - Voice-activated contact alias matching (`baba`, `papa`, `dad`, etc.).
  - Dual dispatch via desktop protocol (`whatsapp://`) and web fallback.

- **🚀 Desktop Automation**:
  - Native protocol launchers (Unity Hub, desktop apps, tabs).

---

## 📁 Project Structure

```text
gesture-prototype/
├── index.html              # Core JARVIS Web HUD & Audio/Vision Engine
├── jarvis-brain.js         # Multi-model Neural Router & Groq LPU Client
├── gesture_controller.py   # Native Python MediaPipe Hand & Cursor Controller
├── run_jarvis_web.bat      # Instant local launcher for the Web HUD
├── run.bat                 # One-click launcher for the Python controller
├── requirements.txt        # Python dependencies (mediapipe, opencv, pyautogui)
└── README.md               # Detailed prototype documentation
```

---

## 🚀 Quick Start

### 1. Web HUD (Voice & Vision)
Simply double-click **`gesture-prototype/run_jarvis_web.bat`** (or open `gesture-prototype/index.html` in Chrome/Edge/Brave).
- Click **"Allow Camera & Start"**.
- Click the **⚙️ Neural Network Settings** icon to configure your Groq API key.
- Speak naturally: *"Hey Jarvis, what's on your mind?"* or *"Jarvis, call Baba on WhatsApp"*.

### 2. Python Native Desktop Gesture Controller
If you want real Windows cursor and desktop window control:
```bash
cd gesture-prototype
pip install -r requirements.txt
python gesture_controller.py
```
*(Or double-click `run.bat`)*

---

## ⚙️ Configuration

Open the Neural Network settings inside the Web HUD:
- **Reflex Model**: `llama-3.3-70b-versatile` / `llama-3.1-8b-instant` via Groq
- **Vision Model**: Gemini 1.5 Flash / Pro
- **Reasoning**: Mistral Small / Large