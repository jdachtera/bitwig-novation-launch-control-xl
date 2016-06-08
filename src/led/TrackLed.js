/**
 *
 * @param {String} midiMessage
 * @param {int} onColor
 * @param {int} offColor
 * @param {Track} track
 * @constructor
 */
function TrackLed(midiMessage, onColor, offColor, track)
{
    LED.call(this, midiMessage, onColor, offColor);
    track.exists().addValueObserver(this.value.setInternal);
}

util.inherits(TrackLed, LED);