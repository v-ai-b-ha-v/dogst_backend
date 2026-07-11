# 🐶 Dogst Backend (dogst_backend)

Welcome to the backend API of **Dogst**, a gamified screen-time tracking service. The backend server manages user sessions, processes daily screen-time logs, tracks daily habit streaks, awards experience points (XP), and handles global user ranking leaderboards.

---

## 🛠️ Tech Stack & Key Services
* **Runtime Environment:** Node.js
* **Application Framework:** Express.js (v5)
* **Database Management:** MongoDB (via Mongoose ODM)
* **Authentication Provider:** Firebase Admin SDK (JWT Validation)
* **Security Layer:** Express Rate Limit (DDoS/Spam prevention)

---

## 🔌 API Endpoints Reference
All routes except base path `/` require authentication. Tokens must be passed in the headers as a Bearer token: `Authorization: Bearer <Firebase_ID_Token>`.

### 1. Base Endpoint
* **GET `/`**
  * **Auth Required:** No
  * **Description:** Health check validation.
  * **Response:** `"DOGST backend is working "`

### 2. User Authentication & Profile
* **POST `/api/user/init`**
  * **Description:** Initializes a new user profile upon sign-up or maps existing database profiles.
  * **Payload:**
    ```json
    {
      "name": "Striver",
      "userTargetScreenTime": 120
    }
    ```
  * **Response:** `200 OK` with user initialization status.

* **GET `/api/user/me`**
  * **Description:** Retrieves the authenticated user's current profile metrics, computed level, and XP needed to progress to the next level.
  * **Response:** Detailed user JSON payload (e.g. `uid`, `email`, `xp`, `streak`, `level`, `reqXP`, `petType`).

### 3. Screen Time & XP Synchronization
* **POST `/api/user/updateStats`**
  * **Description:** Updates usage data. Depending on whether the update happens on the same day or a new day, the behavior adapts:
    1. **Same-Day Updates:** Accepts `screenTimeToday` and updates the active counters.
    2. **Multi-Day Transitions:** Accepts `prevDayScreenTime` and `currentScreenTime`. Evaluates if the previous day met focus goals, increments/resets streaks, rewards streak bonuses, scales level XP, checks for pet evolutions, and resets active tracking for today.
  * **Payload (Same-Day):**
    ```json
    { "screenTimeToday": 105 }
    ```
  * **Payload (New-Day Roll):**
    ```json
    { "prevDayScreenTime": 110, "currentScreenTime": 15 }
    ```
  * **Response:** Sync status including level ups, streak states, and pet evolution status.

* **GET `/api/user/lastUpdated`**
  * **Description:** Retrieves the timestamp of the last statistics synchronization. Used by the mobile app to coordinate timezone alignment.

### 4. Leaderboard & Utilities
* **GET `/api/user/leaderboard`**
  * **Description:** Returns the global leaderboard sorted descending by XP.
  * **Response:** Array of user records including only name and total XP.

* **DELETE `/api/user/delete`**
  * **Description:** Cleanses user data. Deletes the Mongoose user document matching the authenticated UID.

---

## 🛡️ Security Middleware

### A. Authentication Filter (`middleware/authenticate.js`)
Performs token extraction and decodes the JWT using the Firebase Admin Auth SDK:
```javascript
const decodedToken = await admin.auth().verifyIdToken(token);
req.user = decodedToken; // Attaches user metadata to request object
```

### B. Rate Limiting (`middleware/rateLimiter.js`)
Protects key onboarding and updates routes from DDoS attacks by limiting requests to `200 requests per 15 minutes` per IP address.

---

## 🗄️ Database Schema (`models/User.js`)
The user collection maintains the following fields inside MongoDB:
* `uid` (String, Indexed, Unique) — Firebase authentication UID.
* `email` (String) — User profile email.
* `name` (String, default: "Striver") — Account display name.
* `xp` (Number, Indexed, default: 0) — Global user experience points.
* `petType` (String, default: "Chihuahua") — Dynamic pet type based on level.
* `screenTimeToday` (Number) — Today's accumulated screen minutes.
* `userTargetScreenTime` (Number) — Active user threshold.
* `streak` (Number) — Number of consecutive goal completions.
* `lastUpdated` (Date) — Last synchronization timestamp.

---

## 🔧 Installation & Local Setup

1. Navigate to the `dogst_backend` directory:
   ```bash
   cd dogst_backend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Set up environment variables inside a `.env` file in the root:
   ```env
   PORT=8000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dogst
   FB_TYPE=service_account
   FB_PROJECT_ID=your-project-id
   FB_PRIVATE_KEY_ID=your-private-key-id
   FB_PRIVATE_KEY=YmFzZTY0LWVuY29kZWQtcHJpdmF0ZS1rZXk=  # Base64 encoded private key
   FB_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
   ...
   ```
   > 💡 **Base64 Private Keys:** The `FB_PRIVATE_KEY` must be base64-encoded to avoid line break validation issues when parsing environment variables in shell platforms.

4. Launch the server (in development mode using nodemon):
   ```bash
   npm run dev
   ```
