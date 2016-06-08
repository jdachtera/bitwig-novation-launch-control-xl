function Control(midiMessage)
{
    EventEmitter.call(this);
    this.midiMessage = midiMessage;
    this.enabled = true;
    this.connected = true;
    this.active = true;
    this.midiPort = null;
    this.enableFeedback = false;
    this.trackName = '';
    this.name = '';
    this.deviceName = '';
    this.value = new Value();

    this.statusByte = midiMessage.hexByteAt(0);
    this.typeByte = midiMessage.hexByteAt(1);

    this.sendFeedbackValue = this.sendFeedbackValue.bind(this);
    this.updateEnabled = this.updateEnabled.bind(this);
    this.midiPortChanged = this.midiPortChanged.bind(this);
    this.handleMidi = this.handleMidi.bind(this);

    this.on('midiPortChanged', this.midiPortChanged);

    this.on('nameChanged', this.updateEnabled);
    this.on('trackNameChanged', this.updateEnabled);
    this.on('deviceNameChanged', this.updateEnabled);

    this.on('connectedChanged', this.updateEnabled);
    this.on('activeChanged', this.updateEnabled);

    this.on('enabledChanged', this.enabledChanged.bind(this));

    this.on('enableFeedbackChanged', this.enableFeedbackChanged.bind(this));
}

Control.NAME_UNASSIGNED = '__unassigned__';

util.inherits(Control, EventEmitter);

Control.prototype.resolution = 128;
Control.prototype.trueValue = 127;
Control.prototype.falseValue = 0;
Control.prototype.disabledValue = 0;

Control.prototype.enableFeedbackChanged = function ()
{
    if (this.enableFeedback)
    {
        this.value.on('change', this.sendFeedbackValue);
    }
    else
    {
        this.value.off('change', this.sendFeedbackValue);
    }
};

/**
 * @param {Track} track
 */
Control.prototype.connectTrack = function (track)
{
    track.addNameObserver(20, Control.NAME_UNASSIGNED, this.set.bind(this, 'trackName'));
};

/**
 * @param {Device} device
 */
Control.prototype.connectDevice = function (device)
{
    device.addNameObserver(20, Control.NAME_UNASSIGNED, this.set.bind(this, 'deviceName'));
};

/**
 * @param {AutomatableRangedValue} parameter
 */
Control.prototype.connectParameter = function (parameter)
{
    parameter.addValueObserver(this.resolution, this.value.setInternal);
    parameter.addNameObserver(20, Control.NAME_UNASSIGNED, this.set.bind(this, 'name'));
    this.on('enabledChanged', function (active)
    {
        parameter.setIndication(active);
    }.bind(this));
    return this;
};

Control.prototype.updateEnabled = function ()
{
    this.set('enabled', !!this.connected && !!this.active);
};

Control.prototype.isAssigned = function ()
{
    return this.name !== Control.NAME_UNASSIGNED && this.trackName !== Control.NAME_UNASSIGNED && this.deviceName !== Control.NAME_UNASSIGNED
};

Control.prototype.enabledChanged = function ()
{

    if (this.enabled)
    {
        if (this.midiPort)
        {
            this.midiPort.on('midi:' + this.midiMessage, this.handleMidi);
        }
        this.sendFeedbackValue();
    }
    else
    {
        if (this.midiPort)
        {
            this.midiPort.off('midi:' + this.midiMessage, this.handleMidi);
        }
    }
};

/**
 *
 * @param {BooleanValue} booleanValue
 * @returns {Control}
 */
Control.prototype.connectSwitch = function (booleanValue)
{
    booleanValue.addValueObserver(this.value.setInternal);
    return this;
};

Control.prototype.getFeedbackValue = function ()
{
    if (!this.isAssigned())
    {
        return this.disabledValue;
    }
    if (this.value.getInternal() === true)
    {
        return this.trueValue;
    }
    if (this.value.getInternal() === false)
    {
        return this.falseValue;
    }
    return this.value.getInternal();
};

Control.prototype.getRangedValue = function ()
{
    return this.value.getInternal();
};

Control.prototype.sendFeedbackValue = function ()
{
    try {
        this.emit('midi', this.statusByte, this.typeByte, this.getFeedbackValue());
    } catch(e) {
        //console.log(e);
        console.log(this.getFeedbackValue());
    }

};

Control.prototype.midiPortChanged = function (newPort, oldPort)
{
    if (oldPort)
    {
        oldPort.off('midi:' + this.midiMessage, this.handleMidi);
    }
    if (newPort)
    {
        this.on('midi', newPort.sendMidi.bind(newPort));
    }
    this.enabledChanged();
};

Control.prototype.handleMidi = function (status, data1, data2)
{
    this.emit('trigger', status, data1, data2);
};

Control.prototype.emit = function (name)
{
    if ((name === 'midi' || name === 'sysex') && (!this.enabled))
    {
        return;
    }
    EventEmitter.prototype.emit.apply(this, arguments);
};

Control.prototype.onExit = function ()
{
    this.emit('midi', this.statusByte, this.typeByte, this.disabledValue);
};