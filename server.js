const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userjoin, getCurrentUser, userLeave, getRoomUser } = require('./utils/users');


const botname = 'serverBOT';
const server = http.createServer(app);
const io = socketio(server);
// Send static folder

app.use(express.static(path.join(__dirname, 'public')));

// Run on connect

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user = userjoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botname, 'Welcome to Chat'));

        // Broadcast when a user connects

        socket.broadcast.to(user.room)
        .emit('message', formatMessage(botname, `${user.username} has join the chat`));

        io.to(user.room).emit('roomUsers',{

            room:user.room,
            users:getRoomUser(user.room)

        });


    });


    // Listen for chat message

    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    });


    // When the client disconnext

    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room)
            .emit('message', formatMessage(botname, `${user.username} has left the chat`)
            );

            // Send user and room info

            io.to(user.room).emit('roomUsers',{

                room:user.room,
                users:getRoomUser(user.room)
    
            });


        }

    });



});


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))