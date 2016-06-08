/**
 *
 * @param {Array<String>} midiMessages
 * @param {TrackBank} trackBank
 * @constructor
 */
function TrackSelectorButtons(midiMessages, trackBank)
{
    ControlGroup.call(this);
    this.trackBank = trackBank;
    this._previous = this.addControl(new Button(midiMessages.previous)).on('down', this.previous.bind(this));
    this._next = this.addControl(new Button(midiMessages.next)).on('down', this.next.bind(this));
    this.trackBank.addCanScrollTracksUpObserver(this._previous.value.setInternal);
    this.trackBank.addCanScrollTracksDownObserver(this._next.value.setInternal);
}

util.inherits(TrackSelectorButtons, ControlGroup);

TrackSelectorButtons.prototype.next = function ()
{
    this.trackBank.scrollTracksDown();
};

TrackSelectorButtons.prototype.previous = function ()
{
    this.trackBank.scrollTracksUp();
};