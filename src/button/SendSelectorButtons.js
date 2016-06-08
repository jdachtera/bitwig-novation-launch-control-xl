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
    this.mode = 'send';
    this.trackBank.addCanScrollSendsDownObserver(this._previous.value.setInternal)
    this.trackBank.addCanScrollSendsUpObserver(this._next.value.setInternal);

}

util.inherits(SendSelectorButtons, ControlGroup);

SendSelectorButtons.prototype.next = function ()
{
    if (this.mode === 'macro') {
        this.set('mode', 'send');
        this._previous.value.setInternal(true);
    } else {
        this.trackBank.scrollSendsUp();

    }

};

SendSelectorButtons.prototype.previous = function (value)
{
    if (!value) {
        this._previous.value.setInternal(false);
        this.set('mode', 'macro');
    } else {
        this.trackBank.scrollSendsDown();
    }

};