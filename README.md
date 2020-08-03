# React / Spotify / Firebase Boilerplate

A minimal way to get started and build a simple full-stack web app using create-react-app and Firebase.

Boilerplate project setup using:

- Frontend: React w/ `create-react-app`, FCs and Hooks, Typescript
- Backend: Firebase w/ Node.js Cloud Functions, Typescript
- Auth: Includes implementation of Spotify Authorization API

# Get Started

- Clone this repo

### Installation

- Run `npm install` to install the packages declared in `package.json`

### Firebase

- Learn how to set up a firebase project here: [Add Firebase to your Javascript project](https://firebase.google.com/docs/web/setup)
  - Note that Step 3 is partially taken care of with the 'Using module bundlers' approach. See `./src/components/Firebase`.
  - To initialize Firebase, Create a `.env` file and put your firebase config details there, as labelled in `src/components/Firebase/firebase.ts` (example being `REACT_APP_API_KEY={your API key here}`). `.env` is excluded in `.gitignore`
  - **After changing environment variables, you need to restart your development server**
- After installing the firebase CLI, make sure to run `firebase init` to create a `.firebaserc` file, which points your Firebase CLI (deploying functions, firestore/storage rules, etc.) to the right project. Note this might rewrite the `./functions` folder though. Learn more here: [Firebase CLI reference](https://firebase.google.com/docs/cli)

### Spotify
- Retrieve your app's Spotify client ID and secret from the Spotify Developer Dashboard. Use the firebase CLI to upload these to your config as expected in `functions/src/Auth/config.ts`
- Modify the other values in `functions/src/Auth/config.ts` as appropriate
- Miror those values in `src/constants/auth.tsx`. Spotify expects these values to be identical between API calls when exchanging the code for the access and refresh tokens.

### Run

- Run `npm run start`

# Other Details

Frontend:

- Firebase client SDK is implemented via a wrapper/gateway class in `./src/components/Firebase`.
- Convenient React Contexts and hooks set up to provide the Firebase client instance and current user Auth session throughout the React app (`useFirebase()` and `useSession()`)
- Uses `react-router` for routing
- Uses `react-boostrap`

# Other Resources

- [Typescript in 5m](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Intro to React Hooks](https://reactjs.org/docs/hooks-intro.html)

# Questions?

- Have questions? Please open an issue and I'll get back to you by EOD. These are highly welcome--then the readme can be updated to provide this information and be more clear.
- PRs are welcome!
- Good luck on building!

# Thanks
Thanks to @ly-chen for guidance on setting up the Spotify auth flow.