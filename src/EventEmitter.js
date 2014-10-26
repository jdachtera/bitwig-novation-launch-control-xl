function EventEmitter()
{
    this._handlers = {};
}

EventEmitter.prototype._createHandlerArray = function (name)
{
    this._handlers[name] = this._handlers[name] || [];
};

EventEmitter.prototype.on = function (name, handler)
{
    this._createHandlerArray(name);
    this._handlers[name].push(handler);
    return this;
};

EventEmitter.prototype.off = function (name, handler)
{
    if (!handler)
    {
        delete(this._handlers[name]);
    }
    else if (this._handlers[name])
    {
        this._handlers[name].splice(this._handlers[name].indexOf(handler), 1);
    }
    return this;
};

EventEmitter.prototype.emit = function (name)
{
    var args = Array.prototype.slice.call(arguments, 1);

    if (this._handlers[name])
    {
        var handlers = this._handlers[name], length = handlers.length;
        for (var i = 0; i < length; i++)
        {
            handlers[i].apply(null, args);
        }
    }
    return this;
};

EventEmitter.prototype.set = function (property, newValue)
{
    var oldValue = this[property];
    this[property] = newValue;
    if (oldValue !== newValue)
    {
        this.emit(property + 'Changed', newValue, oldValue);
        if (property === 'active')
        {
            this.emit(newValue ? 'activated' : 'deactivated');
        }
    }
    return this;
};

EventEmitter.prototype.get = function (property)
{
    return this[property];
};