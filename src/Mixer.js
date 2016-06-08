function MixerControl(messages, Colors, numberOfScenes)
{
    ControlGroup.call(this);

    this.trackBank = host.createTrackBank(messages.focus.length, messages.sends.length, numberOfScenes || 1);

    this.comboButtons = this.addControl(new ControlGroup(messages.focus.map(function (message, index)
    {
        return (new TrackComboButton(message, this.trackBank.getTrack(index), {
            RecordingSelected: Colors.Mixer.ArmSelected,
            PlayingSelected: Colors.Mixer.SoloOn,
            QueuedSelected: Colors.Mixer.MuteOn,
            RecordingUnselected: Colors.Mixer.ArmUnselected,
            PlayingUnselected: Colors.Mixer.SoloOff,
            QueuedUnselected: Colors.Mixer.MuteOff
        }))
            .set('trueValue', Colors.Mixer.TrackSelected)
            .set('falseValue', Colors.Mixer.TrackUnselected)
            .set('disabledValue', Colors.Mixer.NoTrack);
    }.bind(this)), ['mode']));

    this.modeButtons = this.addControl(new ControlGroup([

        this.muteButtons = new ControlGroup(messages.mute.map(function (message, index)
        {
            return (new TrackMuteButton(message, this.trackBank.getTrack(index)))
                .set('trueValue', Colors.Mixer.MuteOff)
                .set('falseValue', Colors.Mixer.MuteOn)
                .set('disabledValue', Colors.Mixer.NoTrack);
        }.bind(this)), [], 'muteButtons'),

        this.soloButtons = new ControlGroup(messages.solo.map(function (message, index)
        {
            return (new TrackSoloButton(message, this.trackBank.getTrack(index)))
                .set('trueValue', Colors.Mixer.SoloOn)
                .set('falseValue', Colors.Mixer.SoloOff)
                .set('disabledValue', Colors.Mixer.NoTrack);
        }.bind(this)), [], 'soloButtons'),

        this.armButtons = new ControlGroup(messages.arm.map(function (message, index)
        {
            return (new TrackArmButton(message, this.trackBank.getTrack(index)))
                .set('trueValue', Colors.Mixer.ArmSelected)
                .set('falseValue', Colors.Mixer.ArmUnselected)
                .set('disabledValue', Colors.Mixer.NoTrack);
        }.bind(this)), [], 'armButtons')

    ], [], 'modeButtons'));

    this.sends = this.addControl(new ControlGroup(messages.sends.map(function (messages, sendIndex)
    {
        return new ControlGroup(messages.map(function (message, trackIndex)
        {
            return (new TrackSendEncoder(message, this.trackBank.getTrack(trackIndex), sendIndex));
        }.bind(this)));
    }.bind(this))));

    this.pans = this.addControl(new ControlGroup(messages.pans.map(function (message, index)
    {
        return new TrackPanEncoder(message, this.trackBank.getTrack(index));
    }.bind(this))));

    this.faders = this.addControl(new ControlGroup(messages.faders.map(function (message, index)
    {
        return new TrackVolumeEncoder(message, this.trackBank.getTrack(index));
    }.bind(this))));

    var devs = {};
    this.macroEncoders = this.addControl(new ControlGroup([messages.sends[0], messages.sends[1], messages.pans].map(function(messages, macroIndex) {

        return new ControlGroup(messages.map(function (message, trackIndex)
        {
            devs[trackIndex] = devs[trackIndex] || this.trackBank.getTrack(trackIndex).createDeviceSelection("Primary", true);
            return (new DeviceMacroEncoder(message, devs[trackIndex], macroIndex));
        }.bind(this)));
    }.bind(this))));

    this.macroEncoders.set('active', false);

    this.trackSelectors = this.addControl(new TrackSelectorButtons(messages.trackSelectors, this.trackBank));
    this.sendSelectors = this.addControl(new SendSelectorButtons(messages.sendSelectors, this.trackBank));
    this.sceneSelectors = this.addControl(new SceneSelectorButtons(messages.sceneSelectors, this.trackBank, messages.focus.length));

    this.sendSelectors.on('modeChanged', function() {
        this.sends.set('active', this.sendSelectors.mode === 'send');
        this.pans.set('active', this.sendSelectors.mode === 'send');
        this.macroEncoders.set('active', this.sendSelectors.mode === 'macro');
    }.bind(this));
}

util.inherits(MixerControl, ControlGroup);