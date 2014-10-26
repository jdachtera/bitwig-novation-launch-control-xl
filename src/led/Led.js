function LED(midiMessage, onColor, offColor) {
    Control.call(this, midiMessage);
    this.trueValue = onColor;
    this.falseValue = offColor;
	this.disabledValue = offColor;
	this.on('valueChanged', this.sendFeedbackValue.bind(this));
}

util.inherits(LED, Control);