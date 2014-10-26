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
	track.addIsSelectedObserver(this.set.bind(this, 'value'));
	this.on('down', function(selected) {
		track.select();
		this.sendFeedbackValue();
	}.bind(this));
}
util.inherits(TrackFocusButton, Button);