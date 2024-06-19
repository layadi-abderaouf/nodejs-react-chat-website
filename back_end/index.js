const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//import routes
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

var cors = require('cors')
const { notFond, errorHendler } = require('./middleware/error')


dotenv.config()
connectDB();

const app = express()
app.use(express.json())

const port = process.env.PORT || 5000

app.use(cors()) 


//use routes
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);



app.use(notFond)
app.use(errorHendler)

const server = app.listen(port,  console.log(`Example app listening on port ${port}!`))








//socket io
const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://192.168.1.12:3000"
    }
})

io.on("connection",(socket)=>{
  console.log("connected to socket.io");
  socket.on("setup",(userData)=>{
     socket.join(userData._id)
     socket.emit('connected')
  })
  socket.on("join chat",(room)=>{
     socket.join(room)
     
     console.log("user join : " + room);
  })
 
  socket.on("typing",(room,user)=>socket.in(room).emit("typing",user))
  socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
  socket.on("vu",(data)=>{
    socket.in(data[0]).emit("vu-client",data)
  })

  socket.on("new message",(newMessage)=>{
    var chat = newMessage.chat;
    if(!chat.users)return;
    chat.users.forEach((user)=>{
        if(user._id == newMessage.sender._id)return;
        socket.in(user._id).emit("message recived",newMessage)
    })
  })
})