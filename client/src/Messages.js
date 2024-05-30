import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import useInterval from '@use-it/interval';

export function Messages({currentUser, selectedRoom}) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messages, setMessages] = useState([]);
    
    function handleMessageChange(e) {
        setCurrentMessage(e.target.value);
    }

    async function loadMessages() {
        const result = await axios.post("/getmessages", {selectedRoom: selectedRoom});
        setMessages(result.data.reverse());
    }

    async function handleMessageSend(e) {
        e.preventDefault();
        await axios.post("/sendmessage", {currentUser: currentUser, currentMessage: currentMessage, selectedRoom: selectedRoom});
        setCurrentMessage("");
        loadMessages();
    }

    useEffect(() => {
        loadMessages();
        setCurrentMessage("");
    }, [selectedRoom]);

    useInterval(() => {
        loadMessages();
    }, 2000);

    return (
        <>  
            <div className="messagesContainer1">
                <div className="messagesContainer2">
                    {messages.map(function(message) {
                        return (
                            <div className="messageContainer" key={message[3]}>
                                { 
                                    message[2] && message[4] &&
                                    <div className="nameContainer">
                                        <div 
                                        className={(!message[2] || message[1] === currentUser) && "invisible"}>
                                            {message[1]}
                                        </div>
                                        {message[4] && <div className="date">{(new Date(message[3])).toLocaleString()}</div>}
                                        <div 
                                        className={(!message[2] || message[1] !== currentUser) && "invisible"}>
                                            {message[1]}
                                        </div>
                                    </div>
                                }
                                <div>
                                    <button className={message[1] === currentUser? "user message" : "other message"}>
                                        {message[0]} 
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="messageInputContainer">
                <form onSubmit={handleMessageSend}>
                    <input
                        value={currentMessage}
                        onChange={handleMessageChange}
                        type="text"
                        placeholder={`message ${selectedRoom}`}
                        className="messageInput"
                    />
                    <button className="sendButton">Send</button>
                </form>
            </div>
        </>
    )
}