/**
 *
 * @param {String} midiMessage
 * @param {integer} onColor
 * @param {integer} offColor
 * @param {Track} track
 * @constructor
 */
function TrackLed(midiMessage, onColor, offColor, track)
{
	LED.call(this, midiMessage, onColor, offColor);
	track.exists().addValueObserver(this.set.bind(this, 'value'));
}

util.inherits(TrackLed, LED);