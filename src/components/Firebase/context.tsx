import { createContext, useContext } from 'react'
import { Firebase } from './firebase'
const FirebaseContext = createContext<Firebase | null>(null)

const useFirebase = () => {
    const firebase = useContext(FirebaseContext)

    return firebase
}
export { FirebaseContext, useFirebase }
