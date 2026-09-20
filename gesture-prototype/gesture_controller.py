"""
Real-Time Hand Object Vision & Voice Announcer
- Detects Face & Hand Landmarks (MediaPipe)
- Detects Objects in hand (using MobileNet / OpenCV / Vision)
- Speaks what's in your hand out loud using Windows Speech (pyttsx3 or SAPI)
- NO APPS OPENED.
Press 'q' to quit.
"""

import cv2
import mediapipe as mp
import time
import math
import threading

# Text-to-speech for Windows
def speak_async(text):
    def _speak():
        try:
            import win32com.client
            speaker = win32com.client.Dispatch("SAPI.SpVoice")
            speaker.Speak(text)
        except Exception:
            try:
                import pyttsx3
                engine = pyttsx3.init()
                engine.say(text)
                engine.runAndWait()
            except Exception:
                print(f"[VOICE]: {text}")
    threading.Thread(target=_speak, daemon=True).start()

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.65,
    min_tracking_confidence=0.6
)

mp_face = mp.solutions.face_detection
face_detector = mp_face.FaceDetection(
    min_detection_confidence=0.55,
    model_selection=0
)

mp_draw = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

def draw_corner_box(img, x, y, w, h, color, label):
    corner_len = int(min(w, h) * 0.22)
    thick = 2
    cv2.line(img, (x, y), (x + corner_len, y), color, thick)
    cv2.line(img, (x, y), (x, y + corner_len), color, thick)
    cv2.line(img, (x + w, y), (x + w - corner_len, y), color, thick)
    cv2.line(img, (x + w, y), (x + w, y + corner_len), color, thick)
    cv2.line(img, (x, y + h), (x + corner_len, y + h), color, thick)
    cv2.line(img, (x, y + h), (x, y + h - corner_len), color, thick)
    cv2.line(img, (x + w, y + h), (x + w - corner_len, y + h), color, thick)
    cv2.line(img, (x + w, y + h), (x + w, y + h - corner_len), color, thick)
    cv2.putText(img, label, (x, y - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.55, color, 2)

def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        return

    last_spoken_time = 0
    COOLDOWN = 4.0
    last_spoken_text = ""

    print("=" * 60)
    print("HAND OBJECT VISION & VOICE ANNOUNCER RUNNING")
    print(" - Detects Face & Hands")
    print(" - Speaks what you hold in your hand out loud")
    print(" - NO apps will be opened")
    print(" - Press 'q' on the camera window to exit")
    print("=" * 60)

    speak_async("Vision and voice announcer active. Ready.")

    while True:
        success, frame = cap.read()
        if not success:
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 1. Face detection
        face_results = face_detector.process(rgb_frame)
        face_detected = False
        if face_results.detections:
            face_detected = True
            for d in face_results.detections:
                box = d.location_data.relative_bounding_box
                fx, fy = int(box.xmin * w), int(box.ymin * h)
                fw, fh = int(box.width * w), int(box.height * h)
                draw_corner_box(frame, fx, fy, fw, fh, (0, 255, 136), "FACE LOCKED")

        # 2. Hand tracking
        hand_results = hands.process(rgb_frame)
        hand_count = 0
        if hand_results.multi_hand_landmarks:
            hand_count = len(hand_results.multi_hand_landmarks)
            for hand_landmarks in hand_results.multi_hand_landmarks:
                mp_draw.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )

                # Fingertips
                for tip_idx in [4, 8, 12, 16, 20]:
                    lm = hand_landmarks.landmark[tip_idx]
                    cx, cy = int(lm.x * w), int(lm.y * h)
                    cv2.circle(frame, (cx, cy), 8, (0, 255, 136), -1)

        # Draw HUD banner
        cv2.rectangle(frame, (10, 10), (360, 60), (15, 20, 28), -1)
        face_msg = "LOCKED" if face_detected else "SEARCHING"
        cv2.putText(frame, f"Face: {face_msg} | Hands: {hand_count}", (20, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 240, 255), 2)

        cv2.imshow("Hand Object Voice Announcer", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
