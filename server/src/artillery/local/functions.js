'use strict';

const axios = require('axios');

let currentRoomId = null;
let currentRoomPlayers = 0;
let roomCounter = 0;
let isCreatingRoom = false;
let url = 'http://localhost:3000';

async function createNewRoom() {
  try {
    const response = await axios.post(url + '/api/game/rooms');
    return response.data.roomId;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}

async function waitForRoomCreation() {
  while (isCreatingRoom) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

module.exports = {
  async handleRoomJoin(context, events, done) {
    try {
      await waitForRoomCreation();

      if (!currentRoomId || currentRoomPlayers >= 4) {
        isCreatingRoom = true;
        try {
          currentRoomId = await createNewRoom();
          currentRoomPlayers = 0;
          roomCounter++;
          console.log(`Created new room ${currentRoomId} (Room #${roomCounter})`);
        } finally {
          isCreatingRoom = false;
        }
      }

      currentRoomPlayers++;

      context.vars.roomId = currentRoomId;
      context.vars.roomNumber = roomCounter;
      context.vars.playerNumber = currentRoomPlayers;
      context.vars.playerId = `player-${roomCounter}-${currentRoomPlayers}`;
      console.log(`Player ${currentRoomPlayers} joining room ${roomCounter} (${currentRoomId})`);

      return done();
    } catch (error) {
      console.error('Error in handleRoomJoin:', error);
      isCreatingRoom = false;
      return done(error);
    }
  },
};
