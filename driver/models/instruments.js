const { model, Schema } = require('mongoose');

const instrumentsSchema = new Schema(
  {
    instrument_id: { type: String },
    battery_percentage: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Instrument', instrumentsSchema);
