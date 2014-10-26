function MidiPort(host, port)
{
    EventEmitter.call(this);

    port = port === undefined ? 0 : port;

    this.output = host.getMidiOutPort(port);
    this.input = host.getMidiInPort(port);

    this.input.setMidiCallback(this.onMidi.bind(this));
    this.input.setSysexCallback(this.onSysex.bind(this));

}

util.inherits(MidiPort, EventEmitter);

MidiPort.prototype.sendMidi = function (status, data1, data2)
{
    this.output.sendMidi(status, data1, data2);
};

MidiPort.prototype.onSysex = function (data)
{
    this.emit('sysex', data);
};

MidiPort.prototype.sendSysex = function (data)
{
    this.output.sendSysex(data);
};

MidiPort.prototype.onMidi = function (status, data1, data2)
{
    this.emit('midi:' + uint8ToHex(status) + uint7ToHex(data1) + '??', status, data1, data2);

    if ((status & 0xF0) === 0x80 && data2 === 0)
    {
        this.emit('midi:' + uint8ToHex(0x90 | (status & 0x0F)) + uint7ToHex(data1) + '??', status, data1, data2);
    }

    if ((status & 0xF0) === 0x90 && data2 === 0)
    {
        this.emit('midi:' + uint8ToHex(0x80 | (status & 0x0F)) + uint7ToHex(data1) + '??', status, data1, data2);
    }
};