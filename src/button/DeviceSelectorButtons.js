/**
 *
 * @param {CursorDevice} cursorDevice
 * @param {Array<String>} midiMessages
 * @constructor
 */
function DeviceSelectorButtons(cursorDevice, midiMessages)
{
	ControlGroup.call(this);
	this.cursorDevice = cursorDevice;
	this._previous = this.addControl(new Button(midiMessages.previous)).on('down', this.previous.bind(this));
	this._next = this.addControl(new Button(midiMessages.next)).on('down', this.next.bind(this));
	this.cursorDevice.addCanSelectNextObserver(this.setCanSelectNext.bind(this));
	this.cursorDevice.addCanSelectPreviousObserver(this.setCanSelectPrevious.bind(this));
}

util.inherits(DeviceSelectorButtons, ControlGroup);

DeviceSelectorButtons.prototype.setCanSelectPrevious = function(value)
{

	this._previous.set('value', value);
};

DeviceSelectorButtons.prototype.setCanSelectNext = function(value)
{
	this._next.set('value', value);
};

DeviceSelectorButtons.prototype.next = function()
{
	this.cursorDevice.selectNext();
};

DeviceSelectorButtons.prototype.previous = function()
{
	this.cursorDevice.selectPrevious();
};