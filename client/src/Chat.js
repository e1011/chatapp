import {useState} from 'react';
import {Rooms} from './Rooms';
import {Messages} from './Messages';

export function Chat({currentUser, setCurrentUser}) {
    const [selectedRoom, setSelectedRoom] = useState("Main room");

    function logOut() {
        setCurrentUser("");
    }

    return (
        <div className="layoutContainer">
            <div className="leftLayout">
                <div className="logo">Eddy's Chat App</div>
                    <Rooms currentUser={currentUser} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom}/>
                <div className="userInfoContainer">
                    <div className="userInfo">
                        {currentUser}
                        <button className="logoutButton" onClick={logOut}>Log Out</button>
                    </div>
                </div>
            </div>
            <div className="rightLayout">
                <div className="roomName">{selectedRoom}</div>
                <Messages currentUser={currentUser} selectedRoom={selectedRoom}/>
            </div>
        </div>
    )

}