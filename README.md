  The **UAct - Community Service Tracking System** is a digital platform designed to streamline and modernize the way Community Service requirements are monitored for college students at the University of the Assumption. The system provides an organized and efficient approach to tracking each student's required service hours, ensuring that both students and administrators have accurate, real-time information.

  This system allows students to view their applied programs, submit logs of completed service activities, and monitor their remaining hours. Meanwhile, school administrators can manage service programs, review student submissions, and approve or deny completed hours.

  By automating the tracking and validation of community service hours, the system minimizes manual workload, reduces errors, and enhances accountability. It also ensures that the university’s community engagement initiatives are properly documented and aligned with institutional requirements.


  **Github (BackEnd):** https://github.com/g-rown/UAct_BackEnd 
  **Render:** https://uact-backend.onrender.com 
  **Snack Expo:** https://snack.expo.dev/@glennpena/github.com-glennpena-uact_frontend?platform=web 


    ## Setup & Run

    Prerequisites:
    - Node.js (LTS recommended)
    - npm or yarn
    - (Optional) Expo CLI: `npm install -g expo-cli` or use `npx expo`

    Quick start:
    1. Clone the repo and install dependencies:

      ```bash
      git clone https://github.com/g-rown/UAct_FrontEnd.git
      cd UAct_FrontEnd
      npm install
      ```

    2. Configure backend URL (if you are running a local backend):
      - The prototype backend is available at: `https://uact-backend.onrender.com`
      - If you need to point the app to a different backend, update the backend/base URL in `App.js` or in your environment/config file.

    3. Run the app with Expo:

      ```bash
      npm start        # starts Expo dev tools
      # or
      npx expo start
      ```

      - For web: `npx expo start --web`
      - To run on a device: scan the QR code in Expo DevTools with the Expo Go app.

    Troubleshooting:
    - Clear Expo cache: `npx expo start -c`
    - If you run into dependency issues: `rm -rf node_modules package-lock.json && npm install`

    Build / Deployment notes:
    - This project is an Expo-managed React Native app. See Expo docs for building native binaries or deploying the web build.



    Group Members:
    - Ochoa, Pauline Bernadette S.
    - Pineda, Sophia M.

