/**
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackSoloButton(midiMessage, track)
{
    Button.call(this, midiMessage, Button.TYPE_TOGGLE);
    this.connectTrack(track);
    this.connectSwitch(track.getSolo());
}

util.inherits(TrackSoloButton, Button);