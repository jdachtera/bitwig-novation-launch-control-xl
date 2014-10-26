/**
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackVolumeEncoder(midiMessage, track)
{
    Encoder.call(this, midiMessage);
    this.connectTrack(track);
    this.connectParameter(track.getVolume());
}
util.inherits(TrackVolumeEncoder, Encoder);