function Encoder(midiMessage)
{
    Control.call(this, midiMessage);
    this.on('trigger', this._handleTrigger.bind(this));
}

util.inherits(Encoder, Control);

Encoder.prototype._handleTrigger = function (status, data1, value)
{
    this.value.setExternal(value);
};

/**
 * @param {AutomatableRangedValue} parameter
 */
Encoder.prototype.connectParameter = function (parameter)
{
    Control.prototype.connectParameter.call(this, parameter);
    this.on('trigger', function (currentValue, oldValue)
    {
        parameter.set(this.getRangedValue(currentValue, oldValue), this.resolution);
    }.bind(this));
    return this;
};

/**
 *
 * @param {BooleanValue} booleanValue
 * @returns {Control}
 */
Encoder.prototype.connectSwitch = function (booleanValue)
{
    Control.prototype.connectSwitch.call(this, booleanValue);
    this.on('trigger', function (value)
    {
        booleanValue.set(value === this.trueValue);
    }.bind(this));
    return this;
};












