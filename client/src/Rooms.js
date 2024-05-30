import axios from "axios";
import {useState} from "react";
import {useEffect} from "react";

export function Rooms({currentUser, selectedRoom, setSelectedRoom}) {
    const [rooms, setRooms] = useState([]);

    async function loadRooms() {
        const result = await axios.post("/getrooms", {currentUser: currentUser});
        setRooms(result.data);
    }

    useEffect(function() {
        loadRooms();
    }, []);
    
    return (
        <div className="chatRooms">
            {rooms.map(function(room) {
                return (
                    <button 
                    className={selectedRoom === room.name ? "selected chatRoom" : "chatRoom"} 
                    key={room.name} 
                    onClick={() => {setSelectedRoom(room.name);}}
                    >
                        {room.name}
                    </button>
                )

            })}
        </div>
    )
    
}