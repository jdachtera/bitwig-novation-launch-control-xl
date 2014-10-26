/**
 *
 * @param {String} midiMessage
 * @param {Track} track
 * @param {int} sceneIndex
 * @param {string} [event]
 * @constructor
 */
function ClipLaunchButton(midiMessage, track, sceneIndex, event)
{
    Button.call(this, midiMessage);
    event = event || 'down';
    this.sceneIndex = sceneIndex || 0;
    this.track = track;
    this.connectTrack(track);
    this.on(event, this.launchClip.bind(this));
}

util.inherits(ClipLaunchButton, Button);

ClipLaunchButton.prototype.launchClip = function ()
{
    this.track.getClipLauncherSlots().launch(this.sceneIndex);
};