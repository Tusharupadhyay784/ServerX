const http = require('http')
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io')
const port = 3001 || process.env.PORT;
const app = express();
const users = [{}]
app.use(cors());
// cors is used for inter communication between url;
app.get('/', (req, res) => {
    res.send('Hello X This is Weapon X')
})

const server = http.createServer(app);
const io = socketIO(server)
io.on('connection', (socket) => {
    console.log("New Connection Established")
    socket.on('joined', ({ user }) => {
        users[socket.id] = user
        console.log(user + "has Joined")
        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has Joined` }); // jisne message kiya hai usko chhod kr sabke pass jayega message
        socket.emit('welcome', { user: 'Admin', message: `Welcome to the Chat ${users[socket.id]}` })
    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user : users[id],message,id})
        // io meaning ki jo jo connect hai un sabko bhejdo
    })
    socket.on('Disconnect',()=>{
        socket.broadcast.emit('leave',{user : "Admin",message : `${users[socket.id]} has left`});
        console.log("User Left")
    })
})
server.listen(port, () => {
    console.log("Port is running on .... ", port);
})