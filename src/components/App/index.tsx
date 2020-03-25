import React, { useEffect, useContext } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

import * as ROUTES from '../../constants/routes'
import { HomePage } from '../Home'
import { ProfilePage } from '../Profile'
import { useFirebase } from '../Firebase'

const App: React.FC = () => {
    const firebase = useFirebase()

    
    return (
        <Router>
            <Switch>
                <Route path={ROUTES.USERNAME}>
                    <ProfilePage />
                </Route>
                <Route path={ROUTES.ROOT}>
                    <HomePage />
                </Route>
            </Switch>
        </Router>
    )
}

export default App 