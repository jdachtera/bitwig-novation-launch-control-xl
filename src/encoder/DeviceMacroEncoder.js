/**
 *
 * @param {String} midiMessage
 * @param {Device} device
 * @param {int} index
 * @constructor
 */
function DeviceMacroEncoder(midiMessage, device, index)
{
    Encoder.call(this, midiMessage);
    this.connectDevice(device);
    this.connectParameter(device.getMacro(index).getAmount());
    this.value.on('change', function(value) {
        device.getMacro(index).getAmount().set(value, 128);
    }.bind(this));
}

util.inherits(DeviceMacroEncoder, Encoder);