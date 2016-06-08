/**
 *
 * @param {Array<String>} midiMessages
 * @param {TrackBank} trackBank
 * @param {int} numberOfTracks
 * @constructor
 */
function SceneSelectorButtons(midiMessages, trackBank, numberOfTracks)
{
    ControlGroup.call(this);
    this.trackBank = trackBank;
    this.numberOfTracks = numberOfTracks;
    this._previous = this.addControl(new Button(midiMessages.previous)).on('press', this.previous.bind(this));
    this._next = this.addControl(new Button(midiMessages.next)).on('press', this.next.bind(this));
    this.trackBank.addCanScrollScenesUpObserver(this._previous.value.setInternal);
    this.trackBank.addCanScrollScenesDownObserver(this._next.value.setInternal);
    for (var i = 0; i < this.numberOfTracks; i++)
    {
        this.trackBank.getTrack(i).getClipLauncherSlots().setIndication(true);
    }
}

util.inherits(SceneSelectorButtons, ControlGroup);

SceneSelectorButtons.prototype.next = function ()
{
    this.trackBank.scrollScenesDown();
};

SceneSelectorButtons.prototype.previous = function ()
{
    this.trackBank.scrollScenesUp();
};