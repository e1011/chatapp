import {useState} from "react";
import axios from "axios";

export function Login({setCurrentUser}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("");
    const [alert2, setAlert2] = useState("");

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    async function handleRegister(e) {
        e.preventDefault();

        if (username.length < 3){
            setAlert("Username must be at least 3 characters");
            setAlert2("");
        }
        else if (password.length < 3) {
            setAlert("Password must be at least 3 characters");
            setAlert2("");
        }
        else {
            const attempt = await axios.post("/register", {username: username, password: password});
            if (attempt.data === "Taken") {
                setAlert("Username already taken");
                setAlert2("");
            }
            else {
                setAlert("");
                setAlert2("Account created, you may now log in");
            }
        }
        
    }
    async function handleLogin(e) {
        e.preventDefault();

        const attempt = await axios.post("/authenticate", {username: username, password: password});
        if (attempt.data === "None") {
            setAlert("Username does not exist");
            setAlert2("");
        }
        else if (attempt.data === "Wrong") {
            setAlert("Wrong password");
            setAlert2("");
        }
        else {
            setAlert("");
            setAlert2("Logging in...");
            setCurrentUser(username);
        }
    }

    return (
        <div className="loginBg">
            <div className="loginContainer">
                <p className="loginTitle">Chat App Login</p>
                <input
                    value={username}
                    onChange={handleUsernameChange}
                    type="text"
                    placeholder="Username"
                    className="loginInput"
                />
                <input
                    value={password}
                    onChange={handlePasswordChange}
                    type="text"
                    placeholder="Password"
                    className="loginInput"
                />
                <div style={{"marginTop": "15px"}}>
                    <span style={{"color": "rgb(186, 195, 233)", "marginRight": "200px"}}>Remember Me</span>
                    <span style={{"color": "rgb(113, 102, 237)"}}>Forgot Password</span>
                </div>
                <button onClick={handleLogin} className="loginButton">Sign In</button>
                <button onClick={handleRegister} className="registerButton">Register</button>
            </div>
            { alert !== "" ? 
            <div className="alert">{alert}</div> :
            null
            }
            { alert2 !== "" ? 
            <div className="alert2">{alert2}</div> :
            null
            }
        </div>
    )
}