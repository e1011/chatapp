import './App.css';
import axios from "axios";

import {useState} from 'react';
import {useEffect} from 'react';
import {Login} from "./Login";
import {Chat} from "./Chat";

function App() {
  axios.defaults.baseURL = "https://eddy-chat-app-77c7000acec1.herokuapp.com/";
   
  const [currentUser, setCurrentUser] = useState(function () {
      return JSON.parse(localStorage.getItem("currentUser"));
  });

  useEffect(function () {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    currentUser ?
    <Chat currentUser={currentUser} setCurrentUser={setCurrentUser}/> :
    <Login setCurrentUser={setCurrentUser}/>
  );
}

export default App;
