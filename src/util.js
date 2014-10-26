if (!Function.prototype.bind)
{
    Function.prototype.bind = function (oThis)
    {
        if (typeof this !== 'function')
        {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function ()
            {
            },
            fBound = function ()
            {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

// http://jsperf.com/new-vs-object-create-including-polyfill
if (typeof Object.create !== 'function')
{
    Object.create = function (o, props)
    {
        function F()
        {
        }

        F.prototype = o;

        if (typeof(props) === "object")
        {
            for (var prop in props)
            {
                if (props.hasOwnProperty(prop))
                {
                    F[prop] = props[prop];
                }
            }
        }
        return new F();
    };
}

var util = {};

util.inherits = function (Ctor, superCtor)
{
    Ctor.prototype = Object.create(superCtor.prototype);
    Ctor.prototype.constructor = Ctor;
};

var setTimeout, clearTimeout;

(function ()
{
    var ids = {}, current = 0;

    setTimeout = function (callback, ms)
    {
        var id = current++;
        ids[id] = true;
        host.scheduleTask(function ()
        {
            if (ids[id])
            {
                callback();
                delete(ids[id]);
            }
        }, [], ms);
        return id;
    };

    clearTimeout = function (id)
    {
        delete(ids[id]);
    };
})();

var console = {};

console._toString = function (o)
{
    switch (o)
    {
        case false:
        case true:
        case undefined:
        case null:
            return o;
            break;
        default:
            return o.toString();
    }
};

console.log = function ()
{
    println(Array.prototype.slice.call(arguments, 0).map(console._toString).join(', '));
};

console.error = function ()
{
    host.errorln(Array.prototype.slice.call(arguments, 0).map(console._toString).join(', '));
};
