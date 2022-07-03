# Introduction

This project is done to simulate an instrument and driver communication. For this instrument part of node measures battery percentage of laptop and shares with the driver. This project is build keeping in mind that there can be multiple instruments, so for identification hardware uuid is used. All the data of instrument/s is being stored in mongodb which can be extracted using REST API. For data encryption AES256 is used. Below are the steps to setup and run the project. Communication between driver and instrument is done using TCP transport layer and WebSocket application layer.

## Steps To Setup and Run

**NODE version**:v14.18.3

**_NOTE:_** Make sure to keep these ports available for the application to work. 3000, 9000

### Driver

All setup commands are given assuming you are in root directory of the repository. Please, keep separate terminal for driver

1. cd driver
2. npm i
3. npm start
4. wait for "connected to mongodb" message to appear in terminal before proceeding further.

### Instrument

All setup commands are given assuming you are in root directory of the repository. Please, keep separate terminal for instrument

1. cd instrument
2. npm i
3. npm start

## Testing

Once you have successfully setup the project. You will be able to get your device using the below given API. The battery percentage will be given in the response

**curl**
```
curl --location --request GET 'http://localhost:3000/instrument/instruments'
```

---

**response**
```
{
  "data": [
      {
          "_id": "62c20d072b984f5414677c31",
          "instrument_id": "X75H6NQKGH",
          "createdAt": "2022-07-03T21:41:27.223Z",
          "updatedAt": "2022-07-03T21:46:15.044Z",
          "__v": 0,
          "battery_percentage": 55
      }
  ]
}
```
