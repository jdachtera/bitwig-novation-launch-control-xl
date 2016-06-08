/**
 *
 * @param {String} midiMessage
 * @param {Track} track
 * @constructor
 */
function TrackFocusButton(midiMessage, track)
{
    Button.call(this, midiMessage, Button.TYPE_MANUAL);
    this.connectTrack(track);
    track.addIsSelectedObserver(this.value.setInternal);
    this.on('down', function ()
    {
        track.select();
        this.sendFeedbackValue();
    }.bind(this));
}
util.inherits(TrackFocusButton, Button);