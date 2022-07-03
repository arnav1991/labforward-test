const { io } = require('socket.io-client');
const si = require('systeminformation');
const aes256 = require('aes256');

// Global Variables
let instrument_id;
// instrument_id = 'fallback_id';
let registered_on_driver;
const timeout_for_command = 5000;

try {
  socket = io(`ws://localhost:9000`);
} catch (error) {
  console.log(error);
}

// Used to get hardware uuid (unique id) of your computer.
(async () => {
  try {
    uuid_details = await si.uuid();
    instrument_id = uuid_details && uuid_details.hardware;
  } catch (error) {
    console.log(
      'Sorry for the trouble. There has been issue fetching your device id. Kindly comment out line no 6 and re run the program.'
    );
  }
})();

// If device is registered on driver it will start sending data to the driver
setInterval(async function () {
  if (registered_on_driver) {
    let battery_details = await si.battery();
    socket.emit(
      'commandFromInstrument',
      encryptData({
        instrument_id,
        command: 'battery_percentage',
        value: battery_details && battery_details.percent,
      })
    );
  }
}, timeout_for_command);

// request to register instrument
setInterval(async function () {
  if (instrument_id && !registered_on_driver) {
    socket.emit(
      'commandFromInstrument',
      encryptData({
        instrument_id,
        command: 'register_instrument',
        value: instrument_id,
      })
    );
  }
}, 2000);

// handle driver incoming messages
socket.on('commandFromDriver', (data) => {
  data = decryptData(data);
  console.log('command_from_driver:', data);
  if (data && data.command) {
    switch (data.command) {
      case 'registered_on_driver':
        registered_on_driver = true;
        break;
    }
  }
});

///////////////UTILS//////////////////
encryptData = (jsonData) => {
  const data = JSON.stringify(jsonData);
  return aes256.encrypt('sample_key', data);
};

decryptData = (stringData) => {
  const data = aes256.decrypt('sample_key', stringData);
  return JSON.parse(data);
};
