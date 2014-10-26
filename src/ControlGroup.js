/**
 * @param {Array<Control|ControlGroup>} controls
 * @param {Array<string>} [delegatedProperties]
 * @param {string} [name]
 */
function ControlGroup(controls, delegatedProperties, name)
{
    EventEmitter.call(this);
    this.controls = [];
    this.name = name;
    this.active = true;
    this.connected = true;
    this.delegatedProperties = delegatedProperties || [];
    this.delegatedProperties.push('midiPort');
    controls && controls.forEach(this.addControl.bind(this));

    this.on('activeChanged', this.connectedChanged.bind(this));
    this.on('connectedChanged', this.connectedChanged.bind(this));
}

util.inherits(ControlGroup, EventEmitter);

/**
 * Add a sub control
 * @param {Control|ControlGroup} control
 */
ControlGroup.prototype.addControl = function (control)
{
    this.controls.push(control);
    control.set('midiPort', this.midiPort);
    return control;
};

/**
 * Set a property.
 *
 * @param {String} property
 * @param {*} value
 * @returns {ControlGroup}
 */
ControlGroup.prototype.set = function (property, value)
{
    //println('Setting property ' + property + ' to ' + value);
    if (this.delegatedProperties.indexOf(property) > -1)
    {
        var controls = this.controls, length = controls.length;
        //println('Delegating property ' + property + ' to ' + value);
        for (var i = 0; i < length; i++)
        {
            controls[i].set(property, value);
        }
    }
    return EventEmitter.prototype.set.call(this, property, value);
};

ControlGroup.prototype.connectedChanged = function ()
{
    var controls = this.controls, length = controls.length;
    for (var i = 0; i < length; i++)
    {
        controls[i].set('connected', this.active && this.connected);
    }
};

ControlGroup.prototype.sendFeedbackValue = function ()
{
    if (this.connected)
    {
        var controls = this.controls, length = controls.length;
        //println('Delegating property ' + property + ' to ' + value);
        for (var i = 0; i < length; i++)
        {
            controls[i].sendFeedbackValue();
        }
    }
};

ControlGroup.prototype.onExit = function ()
{
    if (this.connected)
    {
        var controls = this.controls, length = controls.length;
        //println('Delegating property ' + property + ' to ' + value);
        for (var i = 0; i < length; i++)
        {
            controls[i].onExit();
        }
    }
};