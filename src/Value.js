function Value()
{
    EventEmitter.call(this);

    this.internalValue = 0;
    this.externalValue = 0;

    this.setMode = this.setMode.bind(this);
    this.setMode('Pickup');

    if (!Value.modeSetting) {
      Value.modeSetting = host.getPreferences().getEnumSetting('Value Mode', 'Encoder', ['Direct', 'Pickup', 'Scale'], 'Direct');
    }
    
    Value.modeSetting.addValueObserver(this.setMode);
}

util.inherits(Value, EventEmitter);

Value.prototype.max = 127;

Value.prototype.getInternal = function()
{
    return this.internalValue;
};
Value.prototype.setMode = function(mode)
{
    var Mode = (Value.Mode[mode] || Value.Mode.Pickup);

    this.setInternal = Mode.setInternal.bind(this);
    this.setExternal = Mode.setExternal.bind(this);
};

Value.Mode = {};
Value.Mode.Direct = {};

Value.Mode.Direct.setInternal = function(value)
{
    this.internalValue = value;
    this.externalValue = value;
    this.emit('change', this.internalValue);

    return this;
};
Value.Mode.Direct.setExternal = function(value)
{
    this.externalValue = value;
    this.internalValue = value;
    return this;
};
Value.Mode.Pickup = {};
Value.Mode.Pickup.setInternal = function(value)
{
    this.internalValue = value;
    this.emit('change', this.internalValue);
    return this;
};
Value.Mode.Pickup.setExternal = function(value)
{
    if (this.externalValue === this.internalValue) {
        this.internalValue = value;
    }
    this.externalValue = value;

    return this;
};

Value.Mode.Scale = {};
Value.Mode.Scale.setInternal = function(value)
{
    this.internalValue = value;
    this.emit('change', this.internalValue);
    return this;
};
Value.Mode.Scale.setExternal = function(value)
{
    var externalValue = this.externalValue,
        internalValue = this.internalValue,
        max = this.max;

    var diff = internalValue - externalValue;

    if (diff < 0) {
        diff *= -1;
    }

    if (diff < 2) {
        internalValue = value;
    } else if (externalValue) {


        var scale = (value > externalValue) ? (max - externalValue) : (externalValue);
        var moveDiff = value - externalValue;
        var increment = moveDiff / scale * diff;

        internalValue += increment;

        if (value < 0) {
            internalValue = 0;
        } else if (value > max) {
            internalValue = max;
        }

    }

    this.internalValue = internalValue;
    this.externalValue = value;

    return this;
};

