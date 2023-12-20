// socket-functions.js

const lobbies = {};
const chat = {};



const initSocketFunctions = (io) => {
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
  

        socket.on("chat message", (data) => {
            console.log(data);

            code = socket.request.session.code;
            chat[code].messages.push(data);
            console.log(chat[code]);

            emitEventToLobbyPlayers(code, 'chat message2', data, io, socket);

        });


        socket.on('get chat', () =>{
          console.log('GETTING CHAT');
          code = socket.request.session.code;
          socket.emit('receive chat', chat, code);

        });











        socket.on('create lobby', (code) => {
          lobbyCode = code.lobbyCode
          console.log(socket.request.session.id);

          lobbies[lobbyCode] = { players: [] };
          chat[lobbyCode] = { messages: [] };

          addPlayerToLobby(lobbyCode, socket);

          console.log(lobbies[lobbyCode]);

        });

        socket.on('join lobby', (code) =>{
          lobbyCode = code.lobbyCode

          console.log(socket.request.session.id);
          if(lobbies[lobbyCode]){
            console.log('Valid Lobby Code');
            console.log(lobbyCode);
            
            addPlayerToLobby(lobbyCode, socket);

            console.log(lobbies[lobbyCode]);


            socket.emit('redirect to lobby', { lobbyCode });
          } else {
            console.log('Invalid Lobby Code');
            console.log(lobbies);
          }

        });



        socket.on('test', ()=> {
          console.log(socket.request.session.id);
        });


      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
  
      // Other socket event handlers...
    });


    function addPlayerToLobby(lobbyCode, socket){

      id = socket.request.session.id;
      user = socket.request.session.username || 'Guest';
      //console.log(socket.request.session);
      info = { id: id,  username: user };
      lobbies[lobbyCode].players.push(info);
  
    }



    function emitEventToLobbyPlayers(lobbyCode, eventName, eventData, io, socket) {
      const lobby = lobbies[lobbyCode];
      console.log('\n\n');
      console.log(lobbyCode, eventName, eventData);
    
      if (lobby) {
        // Iterate over the players in the lobby and emit the event to each player
        lobby.players.forEach(player => {
          const sessionId = player.id; // Assuming session ID is stored as 'id'
          const socket = findSocketBySessionId(io, sessionId);
    
          if (socket) {
            // Emit the event to the socket associated with the session ID
            socket.emit(eventName, eventData);
          } else {
            console.error('Socket not found for session ID:', sessionId);
          }
        });
      }
    }
    
    function findSocketBySessionId(io, sessionId) {
      const sockets = io.sockets.sockets;
    
      const socketArray = Array.from(sockets);
    
      for (const [socketId, socket] of socketArray) {
        if (socket.request.session.id === sessionId) {
          return socket;
        }
      }
    
      return null;
    }
    
    


    
  
  };






  
  module.exports = { initSocketFunctions, chat };
  