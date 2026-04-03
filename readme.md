# Product Requirements Document (PRD): Voice-Powered Obstacle Game

## 1. Concept Overview
A browser-based, 2D side-scrolling web game where the player controls a main avatar (e.g., a rocket or character) moving horizontally. The player encounters 10 sequential obstacles, each represented by an image. To pass the obstacle, the player must correctly pronounce the word associated with the image using their microphone.

## 2. Core User Flow
1. **Initialization:** The user accesses the web app. A modal requests explicit permission to enable the microphone.
2. **Game Start:** Once mic access is granted, the game begins. The player's avatar starts on the left side of the screen and moves horizontally to the right.
3. **Obstacle Encounter:** An obstacle (image) appears on the right side of the screen. The avatar stops moving when it reaches the obstacle. A "Listening..." indicator appears on the screen.
4. **Voice Interaction:** The user attempts to say the word corresponding to the image. 
5. **Validation:** * *Success:* If the spoken word matches the target word, a success animation plays, the obstacle is cleared, and the avatar resumes moving to the next obstacle.
   * *Failure:* If the word is incorrect, the avatar remains blocked, and the user must try again.
6. **Game Over / Win State:** The game concludes when the player successfully clears all 10 words. A victory screen is displayed.

## 3. Functional Requirements
* **Audio Permissions:** The app must handle browser microphone permission requests gracefully, including error states if the user denies access.
* **Speech Recognition:** Implement real-time voice capture. When an obstacle is active, the app should listen for the specific keyword. 
* **Animation & Rendering:** * A 2D canvas or DOM-based animation system. 
  * Smooth horizontal translation for the main avatar.
  * Visual feedback states: "Idle," "Moving," "Listening," "Success," and "Finished."
* **Game Logic:** An array or JSON object storing the 10 levels. Each level object should contain: `{ targetWord: "apple", imageUrl: "/assets/apple.png" }`.

## 4. Technical Architecture Recommendations
*Note for the AI Builder: Use these specific technologies to ensure a lightweight and responsive web app.*
* **Frontend:** React.js (or Vanilla JS/HTML5 Canvas if preferred for simplicity).
* **Styling:** Tailwind CSS for rapid layout of the UI (modals, listening indicators, score).
* **Speech-to-Text:** Start with the native **Web Speech API (`SpeechRecognition`)** for the initial MVP. It is built into most modern browsers and requires no backend or API keys. 
* **Alternative LLM Audio Validation (If high accuracy is needed):** If the native API is too rigid, capture audio using `MediaRecorder`, convert it to base64, and send it to an LLM API with the prompt: *"Did the user say the word [Target Word]? Answer only yes or no."*

## 5. Development Phases for AI Agent
When building this, please execute in the following distinct phases:
* **Phase 1: UI & Animation Loop.** Build the static web layout, the horizontal movement animation, and the logic to spawn and stop at 10 sequential visual obstacles. (Use placeholder squares for images).
* **Phase 2: Mic & Permissions.** Implement the browser microphone permission prompt and build a visible "Listening..." state that toggles on when the avatar hits an obstacle.
* **Phase 3: Speech Validation.** Integrate the SpeechRecognition API to detect words. Connect a successful detection to the logic that clears the obstacle and resumes movement.
* **Phase 4: Polish.** Add the actual images, success visual effects, error handling, and the final win screen.
