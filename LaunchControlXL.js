var CHANNEL = 8;

function LaunchControlXL()
{
	ControlGroup.call(this);

	this.cursorDevice = host.createCursorDevice();

	this.application = host.createApplication();

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

	this.sendLeds = this.addControl(new ControlGroup(Layout[8].leds.slice(0, 2).map(function(messages, sendIndex) {
		return new ControlGroup(messages.map(function(message, index) {
			return new TrackSendLed(message, Colors.Mixer.Sends, Colors.Mixer.NoTrack, this.mixerComponent.trackBank.getTrack(index), sendIndex);
		}.bind(this)));
	}.bind(this))));

	this.panLeds = this.addControl(new ControlGroup(Layout[8].leds[2].map(function(message, index) {
		return new TrackLed(message, Colors.Mixer.Pans, Colors.Mixer.NoTrack, this.mixerComponent.trackBank.getTrack(index));
	}.bind(this))));

	this.modeMuteButton = this.addControl(new Button(Layout[CHANNEL].navigation.mute)).set('enableFeedback', true)
		.on('down', this.switchButtonMode.bind(this, 'mute'))
		.on('down', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'stop'))
		.on('up', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'launch'));
	this.modeSoloButton = this.addControl(new Button(Layout[CHANNEL].navigation.solo)).set('enableFeedback', true)
		.on('down', this.switchButtonMode.bind(this, 'solo'))
		.on('down', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'play'))
		.on('up', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'launch'));
	this.modeArmButton = this.addControl(new Button(Layout[CHANNEL].navigation.record).set('enableFeedback', true))
		.on('down', this.switchButtonMode.bind(this, 'record'))
		.on('down', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'record'))
		.on('up', this.mixerComponent.comboButtons.set.bind(this.mixerComponent.comboButtons, 'mode', 'launch'));

	this.deviceEncoders = this.addControl(new ControlGroup(Layout[CHANNEL].encoders[2].map(function(message, index) {
		return new DeviceParameterEncoder(message, this.cursorDevice, index);
	}.bind(this)))).set('active', false);

	this.deviceLeds = this.addControl(new ControlGroup(Layout[CHANNEL].leds[2].map(function(message, index) {
		return new DeviceParameterLed(message, Colors.Device.Parameters, Colors.Device.NoDevice, this.cursorDevice, index);
	}.bind(this))));

	this.deviceSelectors = this.addControl(new DeviceSelectorButtons(this.cursorDevice, {
		previous: Layout[CHANNEL].navigation.left,
		next: Layout[CHANNEL].navigation.right
	})).set('active', false);

	this.deviceBankSelectors = this.addControl(new ControlGroup(Layout[8].buttons[1].map(function(midiMessage, index) {
		return (new DeviceParameterBankButton(midiMessage, this.cursorDevice, index))
			.set('trueValue', Colors.Device.BankSelected)
			.set('falseValue', Colors.Device.BankUnselected)
			.set('disabledValue', Colors.Device.NoDevice);
	}.bind(this)))).set('active', false);



	this.modeDeviceButton = this.addControl(new Button(Layout[CHANNEL].navigation.device))
		.on('tap', this.toggleEncoderMode.bind(this))
		.on('down', this.switchSelectMode.bind(this, 'device'))
		.on('up', this.switchSelectMode.bind(this, 'track'))
		.on('doubletap', this.application.toggleDevices.bind(this.application));

	setTimeout(function() {
		this.switchEncoderMode('pan');
		this.switchButtonMode('mute');
		this.switchSelectMode('track');
		this.mixerComponent.set('active', true);
	}.bind(this), 200);
};

util.inherits(LaunchControlXL, ControlGroup);

LaunchControlXL.prototype.switchButtonMode = function(mode)
{
	this.mixerComponent.muteButtons.set('active', mode === 'mute');
	this.modeMuteButton.set('value', mode === 'mute' ? Colors.Button.On : Colors.Button.Off);
	this.mixerComponent.soloButtons.set('active', mode === 'solo');
	this.modeSoloButton.set('value', mode === 'solo' ? Colors.Button.On : Colors.Button.Off);
	this.mixerComponent.armButtons.set('active', mode === 'record');
	this.modeArmButton.set('value', mode === 'record' ? Colors.Button.On : Colors.Button.Off);
};

LaunchControlXL.prototype.toggleEncoderMode = function()
{
	this._encoderMode = this._encoderMode === 'pan' ? 'device' : 'pan';
	this.switchEncoderMode(this._encoderMode);
};


LaunchControlXL.prototype.switchEncoderMode = function(mode)
{
	this._encoderMode = mode;
	this.mixerComponent.pans.set('active', mode === 'pan');
	this.panLeds.set('active', mode === 'pan');


	this.deviceLeds.set('active', mode === 'device');
	this.deviceEncoders.set('active', mode === 'device');
	this.modeDeviceButton.set('value', mode === 'device' ? Colors.Button.On : Colors.Button.Off);
};

LaunchControlXL.prototype.switchSelectMode = function(mode)
{
	this.modeDeviceButton.set('value', mode === 'device' || this._encoderMode === 'device');
	this.deviceBankSelectors.set('active', mode === 'device');
	this.mixerComponent.sendSelectors.set('active', mode === 'device');
	this.deviceSelectors.set('active', mode === 'device');

	this.mixerComponent.sceneSelectors.set('active', mode === 'track');
	this.mixerComponent.modeButtons.set('active', mode === 'track');
	this.mixerComponent.trackSelectors.set('active', mode === 'track');

};