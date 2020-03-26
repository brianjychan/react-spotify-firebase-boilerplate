import { createContext, useContext } from 'react'
import firebase from 'firebase'

interface SessionObject {
    initializing: boolean,
    auth: firebase.User | null,
}

const SessionContext = createContext<SessionObject>({
    auth: {} as firebase.User,
    initializing: true
})

const useSession = () => {
    const session = useContext(SessionContext)
    return session
}

export { SessionContext, useSession }

