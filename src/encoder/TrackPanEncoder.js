/**
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackPanEncoder(midiMessage, track)
{
    Encoder.call(this, midiMessage);
    this.connectTrack(track);
    this.connectParameter(track.getPan());
}

util.inherits(TrackPanEncoder, Encoder);