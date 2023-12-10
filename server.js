const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const socketFunctions = require('./socket-functions');
socketFunctions.initSocketFunctions(io);



app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 365 * 24 * 60 * 60 * 1000 } // 1 year in milliseconds
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const homeRouter = require('./routes/home');
const lobbyRouter = require('./routes/lobby');
const setUsername = require('./routes/userRoutes');

app.use('/', homeRouter);
app.use('/lobby', lobbyRouter);
app.use('/user', setUsername);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
