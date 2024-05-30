import express from "express";
import {MongoClient} from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

const uri = `mongodb+srv://eddyzheng04:${encodeURIComponent('password')}@cluster0.93efms8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);
client.connect();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", async function(req, res) {
    res.send("up and running");
})

app.post("/register", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // check if username taken, otherwise create account.
    const taken = await client.db("Chatapp").collection("Users").find({username: username}).toArray();
    if (taken.length !== 0) {
        res.send("Taken");
    }
    else {
        await client.db("Chatapp").collection("Users").insertMany([{username: username, password: password}]);
        res.send("Created");
    }
});

app.post("/authenticate", async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // check if username works, then check if password works.
    const user = await client.db("Chatapp").collection("Users").find({username: username}).toArray();
    if (user.length === 0) {
        res.send("None");
    }
    else if (user[0].password === password) {
        res.send("Pass");
    }
    else {
        res.send("Wrong");
    }
})

app.post("/getrooms", async function(req, res) {
    const user = req.body.currentUser;

    const mainRoom = await client.db("Chatapp").collection("Rooms").find({name: "Main room"}).toArray();
    const testRoom = await client.db("Chatapp").collection("Rooms").find({name: "Test room"}).toArray();
    const rooms = await client.db("Chatapp").collection("Rooms").find({users: user}).toArray();
    rooms.push(mainRoom[0]);
    rooms.push(testRoom[0]);
    res.send(rooms);
})

app.post("/getmessages", async function(req, res) {
    console.log("load");
    const room = req.body.selectedRoom;

    const roomSearch = await client.db("Chatapp").collection("Rooms").find({name: room}).toArray();
    res.send(roomSearch[0].messages);
})

app.post("/sendmessage", async function(req, res) {
    const user = req.body.currentUser;
    const message = req.body.currentMessage;
    const room = req.body.selectedRoom;
    let displayName = true;
    const date = new Date();
    let displayDate = true;

    const roomSearch = await client.db("Chatapp").collection("Rooms").find({name: room}).toArray();
    const messages = roomSearch[0].messages;
    if (messages.length !== 0) {
        const lastMessage = messages[messages.length-1];

        if (lastMessage[1] === user) {
            displayName = false;
        }

        if (displayName === false && (new Date()).getTime() - lastMessage[3].getTime() < 300000) {
            displayDate = false;
        }
    }
    await client.db("Chatapp").collection("Rooms").updateMany({name: room}, {$push: {messages: [message, user, displayName, date, displayDate]}});

    res.send("Sent");
})

app.listen(process.env.PORT || 4040);