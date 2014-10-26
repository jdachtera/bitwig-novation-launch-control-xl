/**
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackArmButton(midiMessage, track)
{
    Button.call(this, midiMessage, Button.TYPE_TOGGLE);
    this.connectTrack(track);
    this.connectSwitch(track.getArm());
}

util.inherits(TrackArmButton, Button);