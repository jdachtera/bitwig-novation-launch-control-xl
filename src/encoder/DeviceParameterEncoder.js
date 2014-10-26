/**
 *
 * @param {String} midiMessage
 * @param {Device} device
 * @param {int} index
 * @constructor
 */
function DeviceParameterEncoder(midiMessage, device, index)
{
    Encoder.call(this, midiMessage);
    this.connectDevice(device);
    this.connectParameter(device.getParameter(index));
}

util.inherits(DeviceParameterEncoder, Encoder);