function LED(midiMessage, onColor, offColor)
{
    Control.call(this, midiMessage);
    this.trueValue = onColor;
    this.falseValue = offColor;
    this.disabledValue = offColor;
    this.value.on('change', this.sendFeedbackValue.bind(this));
}

util.inherits(LED, Control);