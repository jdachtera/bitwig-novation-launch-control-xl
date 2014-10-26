/**
 *
 * @param {Array<String>} midiMessages
 * @param {TrackBank} trackBank
 * @constructor
 */
function SendSelectorButtons(midiMessages, trackBank)
{
    ControlGroup.call(this);
    this.trackBank = trackBank;
    this._previous = this.addControl(new Button(midiMessages.previous)).on('down', this.previous.bind(this));
    this._next = this.addControl(new Button(midiMessages.next)).on('down', this.next.bind(this));
    this.trackBank.addCanScrollSendsUpObserver(this._previous.set.bind(this._previous, 'value'));
    this.trackBank.addCanScrollSendsDownObserver(this._next.set.bind(this._next, 'value'));
}

util.inherits(SendSelectorButtons, ControlGroup);

SendSelectorButtons.prototype.next = function ()
{
    this.trackBank.scrollSendsPageDown();
};

SendSelectorButtons.prototype.previous = function ()
{
    this.trackBank.scrollSendsPageUp();
};