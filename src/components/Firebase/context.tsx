import { createContext, useContext } from 'react'
import { Firebase } from './firebase'


const FirebaseContext = createContext<Firebase>({} as Firebase)

const useFirebase = () => {
    const firebase = useContext(FirebaseContext)

    return firebase
}
export { FirebaseContext, useFirebase }
