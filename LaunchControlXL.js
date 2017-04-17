var CHANNEL = 8;

function LaunchControlXL()
{
    ControlGroup.call(this);

    this.cursorDevice = host.createEditorCursorDevice();

    this.application = host.createApplication();

    this.transport = host.createTransport();

    this.mixerComponent = this.addControl(new MixerControl({
        focus: Layout[CHANNEL].buttons[0],
        solo: Layout[CHANNEL].buttons[1],
        mute: Layout[CHANNEL].buttons[1],
        arm: Layout[CHANNEL].buttons[1],
        sends: [
            Layout[CHANNEL].encoders[0],
            Layout[CHANNEL].encoders[1]
        ],
        pans: Layout[CHANNEL].encoders[2],
        faders: Layout[CHANNEL].faders,
        trackSelectors: {
            previous: Layout[CHANNEL].navigation.left,
            next: Layout[CHANNEL].navigation.right
        },
        sendSelectors: {
            previous: Layout[CHANNEL].navigation.up,
            next: Layout[CHANNEL].navigation.down
        },
        sceneSelectors: {
            previous: Layout[CHANNEL].navigation.up,
            next: Layout[CHANNEL].navigation.down
        }
    }, Colors)).set('active', false);

    this.mixerComponent.soloButtons.set('active', false);
    this.mixerComponent.armButtons.set('active', false);
    this.mixerComponent.muteButtons.set('active', false);

    this.mixerComponent.sendSelectors.set('active', false);

    this.sendLeds = this.addControl(new ControlGroup(Layout[8].leds.slice(0, 2).map(function (messages, sendIndex)
    {
        return new ControlGroup(messages.map(function (message, index)
        {
            return new TrackSendLed(message, Colors.Mixer.Sends, Colors.Mixer.NoTrack, this.mixerComponent.trackBank.getTrack(index), sendIndex);
        }.bind(this)));
    }.bind(this))));

    this.panLeds = this.addControl(new ControlGroup(Layout[8].leds[2].map(function (message, index)
    {
        return new TrackLed(message, Colors.Mixer.Pans, Colors.Mixer.NoTrack, this.mixerComponent.trackBank.getTrack(index));
    }.bind(this))));

    this.modeMuteButton = this.addControl(new Button(Layout[CHANNEL].navigation.mute)).set('enableFeedback', true)
        .on('tap', this.switchButtonMode.bind(this, 'mute'))
        .on('tap', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'stop'))
        .on('hold', function() {
            this.transport.play();
        }.bind(this));
    this.modeSoloButton = this.addControl(new Button(Layout[CHANNEL].navigation.solo)).set('enableFeedback', true)
        .on('tap', this.switchButtonMode.bind(this, 'solo'))
        .on('tap', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'launch'))
        .on('hold', function() {
            this.transport.record();
        }.bind(this));
    this.modeArmButton = this.addControl(new Button(Layout[CHANNEL].navigation.record).set('enableFeedback', true))
        .on('tap', this.switchButtonMode.bind(this, 'record'))
        .on('tap', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'record'))
        .on('hold', function() {
            this.transport.toggleLauncherOverdub();
        }.bind(this));

    this.mixerComponent.comboButtons.set('mode', 'stop');

    this.deviceEncoders = this.addControl(new ControlGroup(Layout[CHANNEL].encoders[2].map(function (message, index)
    {
        return new DeviceParameterEncoder(message, this.cursorDevice, index);
    }.bind(this)))).set('active', false);

    this.deviceLeds = this.addControl(new ControlGroup(Layout[CHANNEL].leds[2].map(function (message, index)
    {
        return new DeviceParameterLed(message, Colors.Mapping[index], Colors.Device.NoDevice, this.cursorDevice, index);
    }.bind(this))))

    this.macroLeds = this.addControl(new ControlGroup(Layout[8].leds.map(function (messages, rowIndex)
    {
        return new ControlGroup(messages.map(function (message, index)
        {
            return (new LED(message,Colors.Mapping[rowIndex], Colors.Mixer.NoTrack)).value.setInternal(true);
        }.bind(this)));
    }.bind(this))));

    this.deviceSelectors = this.addControl(new DeviceSelectorButtons(this.cursorDevice, {
        previous: Layout[CHANNEL].navigation.left,
        next: Layout[CHANNEL].navigation.right
    })).set('active', false);

    this.deviceBankSelectors = this.addControl(new ControlGroup(Layout[8].buttons[1].map(function (midiMessage, index)
    {
        return (new DeviceParameterBankButton(midiMessage, this.cursorDevice, index))
            .set('trueValue', Colors.Device.BankSelected)
            .set('falseValue', Colors.Device.BankUnselected)
            .set('disabledValue', Colors.Device.NoDevice);
    }.bind(this)))).set('active', false);

    this.modeDeviceButton = this.addControl(new Button(Layout[CHANNEL].navigation.device))
        .on('tap', this.toggleEncoderMode.bind(this))
        .on('down', this.switchSelectMode.bind(this, 'device'))
        .on('up', this.switchSelectMode.bind(this, 'track'))
        .on('doubletap', this.toggleDevices.bind(this));

    setTimeout(function ()
    {
        this.switchEncoderMode('pan');
        this.switchButtonMode('mute');
        this.switchSelectMode('track');
        this.mixerComponent.set('active', true);
    }.bind(this), 200);
}

util.inherits(LaunchControlXL, ControlGroup);

LaunchControlXL.prototype.toggleDevices = function ()
{
    this.application.toggleDevices();
};

LaunchControlXL.prototype.switchButtonMode = function (mode)
{
    this.mixerComponent.muteButtons.set('active', mode === 'mute');
    this.modeMuteButton.value.setInternal(mode === 'mute' ? Colors.Button.On : Colors.Button.Off);
    this.mixerComponent.soloButtons.set('active', mode === 'solo');
    this.modeSoloButton.value.setInternal(mode === 'solo' ? Colors.Button.On : Colors.Button.Off);
    this.mixerComponent.armButtons.set('active', mode === 'record');
    this.modeArmButton.value.setInternal(mode === 'record' ? Colors.Button.On : Colors.Button.Off);
    this.modeArmButton.value.setInternal(mode === 'record' ? Colors.Button.On : Colors.Button.Off);
};

LaunchControlXL.prototype.toggleEncoderMode = function ()
{
    this._encoderMode = this._encoderMode === 'pan' ? 'device' : 'pan';
    this.switchEncoderMode(this._encoderMode);
};

LaunchControlXL.prototype.switchEncoderMode = function (mode)
{

    var realMode = (mode === 'pan' ? (this.mixerComponent.sendSelectors.mode === 'macro' ? 'macro' : 'pan') : 'device');

    host.showPopupNotification('Encoder Mode: ' + ({macro: 'Macros', 'pan': 'Sends/Panning', device: 'Sends/Device'})[realMode]);

    this._encoderMode = mode;
    this.mixerComponent.pans.set('active', realMode === 'pan');
    this.panLeds.set('active', realMode === 'pan');
    this.sendLeds.set('active', realMode !== 'macro');

    this.macroLeds.set('active', realMode === 'macro');

    this.deviceLeds.set('active', realMode === 'device');
    this.deviceEncoders.set('active', realMode === 'device');
    this.modeDeviceButton.value.setInternal(realMode === 'device' ? Colors.Button.On : Colors.Button.Off);
};

LaunchControlXL.prototype.switchSelectMode = function (mode)
{
    this.modeDeviceButton.value.setInternal(mode === 'device' || this._encoderMode === 'device');
    this.deviceBankSelectors.set('active', mode === 'device');
    this.mixerComponent.sendSelectors.set('active', mode === 'device');
    this.deviceSelectors.set('active', mode === 'device');

    this.mixerComponent.sceneSelectors.set('active', mode === 'track');
    this.mixerComponent.modeButtons.set('active', mode === 'track');
    this.mixerComponent.trackSelectors.set('active', mode === 'track');

    this.switchEncoderMode(this._encoderMode);

};
