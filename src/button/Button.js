function Button(midiMessage, type)
{
    Control.call(this, midiMessage);

    this.on('trigger', this._handleTrigger.bind(this));
    this.on('down', this._handleDown.bind(this));
    this.on('hold', this._handleHoldPulse.bind(this));
    this.on('up', this._handleUp.bind(this));
    this.on('tap', this._handleTap.bind(this));

    this.state = Button.STATE_UP;
    this.holdTimer = null;

    this.holdDelay = Button.HOLD_DELAY;
    this.holdPulseDelay = Button.HOLD_PULSE_DELAY;

    this.type = (type === undefined ? Button.TYPE_MANUAL : type);

    this.set('enableFeedback', true);
}

Button.STATE_UP = 0;
Button.STATE_DOWN = 1;
Button.STATE_HOLD = 2;

Button.HOLD_DELAY = 300;
Button.HOLD_PULSE_DELAY = 50;
Button.DOUBLETAP_DELAY = 300;

Button.TYPE_MOMENTARY = 0;
Button.TYPE_TOGGLE = 1;
Button.TYPE_MANUAL = 2;

util.inherits(Button, Control);

Button.prototype.downValue = 127;
Button.prototype.upValue = 0;

Button.prototype._handleTrigger = function (status, data1, value)
{
    switch (value)
    {
        case this.downValue:
            this.state = Button.STATE_DOWN;
            this.emit('down');
            this.emit('press');
            break;
        case this.upValue:
            if (this.state === Button.STATE_DOWN)
            {
                this.emit('tap');
            }
            this.state = Button.STATE_UP;
            this.emit('up');
            break;
    }
};

Button.prototype._handleDown = function ()
{
    clearTimeout(this.holdTimer);
    this.holdTimer = setTimeout(this._handleHoldTimeout.bind(this), this.holdDelay);
};

Button.prototype._handleHoldTimeout = function ()
{
    this.state = Button.STATE_HOLD;
    this.emit('hold');
};

Button.prototype._handleUp = function ()
{
    clearTimeout(this.holdTimer);
    clearTimeout(this.holdPulseTimer);
};

Button.prototype._handleHoldPulse = function ()
{
    if (this.state === Button.STATE_HOLD)
    {
        this.emit('holdpulse');
        this.emit('press');
        this.holdPulseTimer = setTimeout(this._handleHoldPulse.bind(this), this.holdPulseDelay);
    }
};

Button.prototype._handleTap = function ()
{
    clearTimeout(this.tapTimer);
    this.tapCount++;
    if (this.tapCount === 2)
    {
        this.tapCount = 0;
        this.emit('doubletap');

    }
    else
    {
        this.tapTimer = setTimeout(function ()
        {
            this.tapCount = 0;
        }.bind(this), Button.DOUBLETAP_DELAY);
    }
};

/**
 * @param {AutomatableRangedValue} parameter
 */
Button.prototype.connectParameter = function (parameter)
{
    Control.prototype.connectParameter.call(this, parameter);
    if (this.type === Button.TYPE_MOMENTARY)
    {

        this.on('down', function ()
        {
            parameter.set(this.trueValue, this.resolution);
        }.bind(this));

        this.on('up', function ()
        {
            parameter.set(this.falseValue, this.resolution);
        }.bind(this));

    }
    else if (this.type === Button.TYPE_TOGGLE)
    {
        this.on('down', function ()
        {
            parameter.set(this.value.getInternal() === this.trueValue ? this.falseValue : this.trueValue, this.resolution);
        }.bind(this));
    }
    return this;
};

/**
 *
 * @param {BooleanValue} booleanValue
 * @returns {Control}
 */
Button.prototype.connectSwitch = function (booleanValue)
{
    Control.prototype.connectSwitch.call(this, booleanValue);
    if (this.type === Button.TYPE_MOMENTARY)
    {

        this.on('down', function ()
        {
            booleanValue.set(true);
        }.bind(this));

        this.on('up', function ()
        {
            booleanValue.set(false);
        }.bind(this));

    }
    else if (this.type === Button.TYPE_TOGGLE)
    {
        this.on('down', function ()
        {
            booleanValue.set(!this.value.getInternal());
        }.bind(this));
    }
    return this;
};


























