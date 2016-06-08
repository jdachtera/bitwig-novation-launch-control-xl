/**
 *
 * @param {String} midiMessage
 * @param {Track} track
 * @param {Object} colors
 * @constructor
 */
function TrackComboButton(midiMessage, track, colors)
{
    TrackFocusButton.call(this, midiMessage, track);
    this.colors = colors;
    this.mode = 'launch';
    this.track = track;
    this.on('hold', this.doAction.bind(this));
    track.getClipLauncherSlots().addIsPlayingObserver(this.setState.bind(this, 'isPlaying'));
    track.getClipLauncherSlots().addIsRecordingObserver(this.setState.bind(this, 'isRecording'));
    track.getClipLauncherSlots().addIsQueuedObserver(this.setState.bind(this, 'isQueued'));
    this.on('isPlayingChanged', this.sendFeedbackValue.bind(this));
    this.on('isRecordingChanged', this.sendFeedbackValue.bind(this));
    this.on('isQueuedChanged', this.sendFeedbackValue.bind(this));
}

util.inherits(TrackComboButton, TrackFocusButton);

TrackComboButton.prototype.getFeedbackValue = function ()
{
    if (this.value.getInternal())
    {
        if (this.isPlaying)
        {
            return this.colors.PlayingSelected;
        }
        else if (this.isRecording)
        {
            return this.colors.RecordingSelected;
        }
        else if (this.isQueued)
        {
            return this.colors.QueuedSelected;
        }
    }
    else
    {
        if (this.isPlaying)
        {
            return this.colors.PlayingUnselected;
        }
        else if (this.isRecording)
        {
            return this.colors.RecordingUnselected;
        }
        else if (this.isQueued)
        {
            return this.colors.QueuedUnselected;
        }
    }
    return Control.prototype.getFeedbackValue.call(this);
};

TrackComboButton.prototype.setState = function (key, value, state)
{
    EventEmitter.prototype.set.call(this, key, state);
};

TrackComboButton.prototype.doAction = function ()
{
    switch (this.mode)
    {
        case 'launch':
            this.track.getClipLauncherSlots().launch(0);
            break;
        case 'stop':
            this.track.getClipLauncherSlots().stop();
            break;
        case 'play':
            this.track.getClipLauncherSlots().showInEditor(0);
            break;
        case 'record':
            this.track.getArm().set(true);
            this.track.getClipLauncherSlots().record(0);
            break;

    }
};