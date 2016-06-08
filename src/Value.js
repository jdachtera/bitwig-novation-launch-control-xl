function Value()
{
    EventEmitter.call(this);
    this.setInternal = this.setInternal.bind(this);
    this.setExternal = this.setExternal.bind(this);
    this.setMode = this.setMode.bind(this);
    this.setMode('Pickup');

    if (!Value.modeSetting) {
      Value.modeSetting = host.getPreferences().getEnumSetting('Value Mode', 'Encoder', ['Direct', 'Pickup', 'Scale'], 'Direct');
    }
    
    Value.modeSetting.addValueObserver(this.setMode);
}
util.inherits(Value, EventEmitter);

Value.prototype.setInternal = function(value)
{
    this.mode.setInternal(value);
    this.emit('change', this.getInternal());
    return this;
};
Value.prototype.setExternal = function(value)
{
    this.setInternal(this.mode.setExternal(value).getInternal());
    return this;
};
Value.prototype.getInternal = function()
{
    return this.mode.getInternal();
};
Value.prototype.setMode = function(mode)
{
    var ctor = (Value.Mode[mode] || Value.Mode.Pickup);
    if (!this.mode || this.mode.constructor !== ctor) {
        var newMode = new ctor();
        if (this.mode) {
            newMode.setInternal(this.mode.getInternal());
            newMode.setExternal(this.mode.getExternal());
        }
        this.mode = newMode;
    }
};

Value.Mode = {};
Value.Mode.Direct = function()
{
    this.externalValue = 0;
    this.internalValue = 0;
};
Value.Mode.Direct.prototype.getInternal = function()
{
    return this.internalValue;
};
Value.Mode.Direct.prototype.getExternal = function()
{
    return this.externalValue;
};
Value.Mode.Direct.prototype.setInternal = function(value)
{
    this.internalValue = value;
    this.externalValue = value;
    return this;
};
Value.Mode.Direct.prototype.setExternal = function(value)
{
    this.externalValue = value;
    this.internalValue = value;
    return this;
};

Value.Mode.Pickup = function() {};
util.inherits(Value.Mode.Pickup, Value.Mode.Direct);

Value.Mode.Pickup.prototype.setInternal = function(value)
{
    this.internalValue = value;
    return this;
};
Value.Mode.Pickup.prototype.setExternal = function(value)
{
    if (this.externalValue === this.internalValue) {
        this.internalValue = value;
    }
    this.externalValue = value;

    return this;
};
