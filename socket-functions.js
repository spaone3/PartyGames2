// socket-functions.js

const lobbies = {};
const chat = {};
const host = {};
const status = {};
const wordleInfo = {};

const { WORDS } = require("./words.js");

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

        socket.on('set username', (username) =>{
          const id = socket.request.session.id;
          const name = username.username;
          const code = socket.request.session.code;
          const currentLobby = lobbies[code];



          console.log(currentLobby, id, name);
          for(let i=0; i<currentLobby.players.length; i++){
            const player = currentLobby.players[i];
            if(player.id == id){
              player.username = name;
              break;
            }
          }
          console.log(currentLobby);
        });


        socket.on('play game', (event) =>{

          lobbyCode = socket.request.session.code;

          if(host[lobbyCode] == socket.request.session.id){
            eventName = 'switch games';
            eventData = { lobbyCode, event };
            status[lobbyCode] = 'closed';

            emitEventToLobbyPlayers(lobbyCode, eventName, eventData, io, socket);
          }
        });

        socket.on('return to lobby', (event) =>{
          lobbyCode = socket.request.session.code;
          if(host[lobbyCode] == socket.request.session.id){
            eventName = 'to lobby screen';
            eventData = {lobbyCode};
            status[lobbyCode] = 'open';

            emitEventToLobbyPlayers(lobbyCode, eventName, eventData, io, socket);
          }
        });


        socket.on('letter input', ( letter1 ) => {
          // Process the letter, update the word, and broadcast it to all clients
          console.log(wordleInfo[code].status );
          if(wordleInfo[code].status == 1) return;
          letter = letter1.letter;
          code = socket.request.session.code;
          currentWord = wordleInfo[code].currentWord;
          //console.log(letter);

          if(wordleInfo[code].guessesRemaining == 0) return;

          //console.log(letter, wordleInfo[code].nextLetter )

          if(letter == 'Backspace' && wordleInfo[code].nextLetter !=0){
            updatedWord = currentWord.slice(0, -1);
            wordleInfo[code].currentWord = updatedWord;
            console.log('DELETION', updatedWord);

            info = {nextLetter: wordleInfo[code].nextLetter, guessesRemaining: wordleInfo[code].guessesRemaining };
            emitEventToLobbyPlayers(code, 'delete letter',  info, io, socket);
            wordleInfo[code].nextLetter -=1;
            return;
          }


          if(letter == 'Enter'){

            info = {nextLetter: wordleInfo[code].nextLetter, guessesRemaining: wordleInfo[code].guessesRemaining, currentWord: wordleInfo[code].currentWord, WORDS: WORDS, rightGuess: wordleInfo[code].randomWord }
            emitEventToLobbyPlayers(code, 'check guess', info, io, socket);

          }



          if(isAlphabetic(letter) && wordleInfo[code].nextLetter != 5){
            updatedWord = currentWord + letter;
            wordleInfo[code].currentWord = updatedWord;

            info = {nextLetter: wordleInfo[code].nextLetter, letter: letter, guessesRemaining: wordleInfo[code].guessesRemaining };
            emitEventToLobbyPlayers(code, 'add letter', info, io, socket);
            wordleInfo[code].nextLetter +=1;
          }
        });


        socket.on('valid guess', (info) =>{
          console.log(info);
          wordleInfo[code].nextLetter = info.nextLetter;
          wordleInfo[code].guessesRemaining = info.guessesRemaining;
          wordleInfo[code].currentWord = info.currentGuess;
        });

        socket.on('game over', () =>{
          console.log('GAME OVER');
          wordleInfo[code].status = 1;
        });



        socket.on('generate word', () =>{
          code = socket.request.session.code;
          wordleInfo[code] =  { status: 0, randomWord: 'ocean', currentWord: '', guessesRemaining: 6, nextLetter: 0};
        });



        socket.on('create lobby', (code) => {
          lobbyCode = code.lobbyCode
          console.log(socket.request.session.id);

          lobbies[lobbyCode] = { players: [] };
          chat[lobbyCode] = { messages: [] };
          host[lobbyCode] = socket.request.session.id;
          status[lobbyCode] = 'open';

          addPlayerToLobby(lobbyCode, socket);

          console.log(lobbies[lobbyCode]);

        });

        socket.on('join lobby', (code) =>{
          lobbyCode = code.lobbyCode

          console.log(socket.request.session.id);
          if(lobbies[lobbyCode] && status[lobbyCode] == 'open'){
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

    function isAlphabetic(character) {
      // Regular expression to match alphabetic characters
      const alphabeticRegex = /^[a-zA-Z]$/;
      
      // Test if the character matches the alphabetic pattern
      return alphabeticRegex.test(character);
    }

    function emitEventToLobbyPlayers(lobbyCode, eventName, eventData, io, socket) {
      const lobby = lobbies[lobbyCode];
      //console.log('\n\n');
      //console.log(lobbyCode, eventName, eventData);
    
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






  
  module.exports = { initSocketFunctions, lobbies, chat, host };
  