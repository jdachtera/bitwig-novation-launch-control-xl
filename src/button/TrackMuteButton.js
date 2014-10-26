/**
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackMuteButton(midiMessage, track)
{
    Button.call(this, midiMessage, Button.TYPE_TOGGLE);
    this.connectTrack(track);
    this.connectSwitch(track.getMute());
}

util.inherits(TrackMuteButton, Button);