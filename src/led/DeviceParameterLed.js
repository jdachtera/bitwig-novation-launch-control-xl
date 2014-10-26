/**
 *
 * @param {String} midiMessage
 * @param {integer} onColor
 * @param {integer} offColor
 * @param {Device} track
 * @param {integer} index
 * @constructor
 */
function DeviceParameterLed(midiMessage, onColor, offColor, device, index)
{
	LED.call(this, midiMessage, onColor, offColor);
	device.getParameter(index).addNameObserver(20, Control.NAME_UNASSIGNED, this.set.bind(this, 'name'));
	this.on('nameChanged', this.nameChanged.bind(this));
}

util.inherits(DeviceParameterLed, LED);

DeviceParameterLed.prototype.nameChanged = function()
{
	this.set('value', this.name !== Control.NAME_UNASSIGNED);
}