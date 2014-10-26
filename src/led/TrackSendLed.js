/**
 *
 * @param {String} midiMessage
 * @param {integer} onColor
 * @param {integer} offColor
 * @param {Track} track
 * * @param {integer} sendIndex
 * @constructor
 */
function TrackSendLed(midiMessage, onColor, offColor, track, sendIndex)
{
	LED.call(this, midiMessage, onColor, offColor);
	track.getSend(sendIndex).addNameObserver(20, Control.NAME_UNASSIGNED, this.set.bind(this, 'name'));
	this.on('nameChanged', this.nameChanged.bind(this));
}

util.inherits(TrackSendLed, LED);

TrackSendLed.prototype.nameChanged = function()
{
	this.set('value', this.name !== Control.NAME_UNASSIGNED);
};