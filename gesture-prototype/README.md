# 🖐️ Hand Gesture & Fingertip Vision Controller (Prototype)

This prototype detects your hand landmarks and fingertips in real-time and triggers actions (such as launching Unity Hub, moving your cursor, or clicking).

---

## ⚡ Option 1: Instant Browser Test (No Installation Required!)

You can test this right now without installing anything:

1. Double-click or open **[`index.html`](./index.html)** in Google Chrome, Edge, or Brave.
2. Click **"Allow Camera & Start"**.
3. Hold your hand up to the webcam!

### Tested Gestures:
- ✌️ **Peace / V-Sign** (Index + Middle up) &rarr; **Launches Unity Hub** (`unityhub://`)
- 🤏 **Fingertip Pinch** (Index + Thumb tips meet) &rarr; **Simulates Click**
- ☝️ **Index Pointing** &rarr; **Move cursor / Focus**
- 🖐️ **Open Palm** &rarr; **System Neutral / Reset**

---

## 💻 Option 2: Native Windows Controller (Python)

If you want direct desktop control (moving the real Windows mouse cursor and launching Windows `.exe` programs):

1. Make sure Python 3.9–3.11 is installed on your PC with PATH enabled.
2. Double-click **[`run.bat`](./run.bat)**, or run in PowerShell/CMD:
   ```bash
   pip install -r requirements.txt
   python gesture_controller.py
   ```
3. Press **`q`** on the video window anytime to exit.
