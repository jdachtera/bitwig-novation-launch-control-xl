/**
 *
 * @param {String} midiMessage
 * @param {Device} device
 * @param {int} index
 * @constructor
 */
function DeviceParameterBankButton(midiMessage, device, index)
{
    Button.call(this, midiMessage);
    this.device = device;
    this.index = index;
    this.connectDevice(device);
    this.device.addSelectedPageObserver(-1, function (page)
    {
        this.value.setInternal(page === this.index);
    }.bind(this));
    this.on('down', this.selectPage.bind(this));
}

util.inherits(DeviceParameterBankButton, Button);

/**
 * Selects the page index associated with this button
 */
DeviceParameterBankButton.prototype.selectPage = function ()
{
    this.device.setParameterPage(this.index);
};