import React from 'react';
import { useParams } from 'react-router-dom';



const ProfilePage: React.FC = () => {
    const { username } = useParams()

    return (
        <div>
            <p>ProfilePage: {username}</p>
        </div>
    )
}

export { ProfilePage }
