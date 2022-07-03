const config = require('config');
const { Server } = require('socket.io');
const aes256 = require('aes256');
const instrumentDataAccess = require('../models/instruments');
const io = new Server(config.driver_websocket_port);
let connectionList = {};
let funcs = {};

io.on('connection', (socket) => {
  // send a message to the client
  socket.emit(
    'commandFromDriver',
    encryptData({ command: 'connected_to_driver' })
  );

  // receive a message from the client
  socket.on('commandFromInstrument', async (data) => {
    data = decryptData(data);
    connectionList[data.instrument_id] = socket;
    console.log('command_from_instrument:', data);
    if (data && data.command) {
      try {
        switch (data.command) {
          case 'register_instrument':
            let device = await instrumentDataAccess.findOne({
              instrument_id: data.instrument_id,
            });
            if (!device) {
              await instrumentDataAccess.create({
                instrument_id: data.instrument_id,
              });
            }
            socket.emit(
              'commandFromDriver',
              encryptData({
                command: 'registered_on_driver',
              })
            );
            break;
          case 'battery_percentage':
            await instrumentDataAccess.findOneAndUpdate(
              { instrument_id: data.instrument_id },
              { battery_percentage: data.value }
            );
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

////////////////UTILS/////////////////
encryptData = (jsonData) => {
  const data = JSON.stringify(jsonData);
  return aes256.encrypt(config.encryption_key, data);
};

decryptData = (stringData) => {
  const data = aes256.decrypt(config.encryption_key, stringData);
  return JSON.parse(data);
};

////API RELATED SERVICE///////////////
funcs.getAllInstruments = () => {
  return instrumentDataAccess.find();
};

module.exports = funcs;
