# React / Firebase / Typescript Boilerplate
A minimal way to get started and build a simple full-stack web app using create-react-app and Firebase.

Boilerplate project setup using:

- React frontend (through create-react-app): Typescript, functional components, hooks
- Firebase w/ Node.js Cloud Functions, in Typescript
- Comes with Twitter Login

- Skeleton structure and context implementation influenced by the structure used by Robin Wieruch in his [React/Firebase tutorials](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial). This boilerplate translates that tutorial's Class Components and HOCs into their functional component / hook counterparts.

# Implementation Details
Frontend
- React frontend initialized with create-react-app with Typescript. Functional Components and Hooks.
- Firebase client SDK is implemented via a wrapper/gateway class in `./src/components/Firebase`. 
- Convenient React Contexts and hooks set up to provide the Firebase client instance and current user Auth session throughout the React app (`useFirebase()` and `useSession()`)
- Twitter Redirect Login implemented
- Uses `react-router` for routing
- Comes with `react-boostrap`

Backend
- Firebase backend
- Cloud Functions can connect to Firestore with admin privileges due to them executing on Firebase servers
- Provided sample Cloud Functions are of the type called [directly via the client SDK](https://firebase.google.com/docs/functions/callable)
- Node.js Cloud Functions, also written in Typescript

# How to use
- Clone this repo
- Run `npm install` to install the packages declared in `package.json`
- Learn how to set up a firebase project here: [Add Firebase to your Javascript project](https://firebase.google.com/docs/web/setup)
    - Note that Step 3 is partially taken care of with the 'Using module bundlers' approach. See `./src/components/Firebase`.
    - To initialize Firebase, Create a `.env` file and put your firebase config details there, as labelled in `src/components/Firebase/firebase.ts` (example being `REACT_APP_API_KEY={your API key here}`). `.env` is excluded in `.gitignore`
    - After changing environment variables, you need to restart your development server
- After installing the firebase CLI, make sure to run `firebase init` to create a `.firebaserc` file, which points your Firebase CLI (deploying functions, firestore/storage rules, etc.) to the right project. Note this might rewrite the `./functions` folder though. Learn more here: [Firebase CLI reference](https://firebase.google.com/docs/cli)
- Twitter login
    - Get started with Twitter Developer: [Getting started](https://developer.twitter.com/en/docs/basics/getting-started)
    - Make sure to configure your Firebase project to allow auth through Twitter. [Authenticate Using Twitter](https://firebase.google.com/docs/auth/web/twitter-login)
    
- Run `npm run start`

# Other Resources
- [Typescript in 5m](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Intro to React Hooks](https://reactjs.org/docs/hooks-intro.html)


# Questions?

- Have questions? Please open an issue and I'll get back to you by EOD. These are highly welcome--then the readme can be updated to provide this information and be more clear.
- PRs are welcome!
- Good luck on building!
