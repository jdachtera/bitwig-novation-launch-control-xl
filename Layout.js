var Layout = (function ()
{
    var encoders = [
        [13, 14, 15, 16, 17, 18, 19, 20],
        [29, 30, 31, 32, 33, 34, 35, 36],
        [49, 50, 51, 52, 53, 54, 55, 56]
    ];

    var faders = [77, 78, 79, 80, 81, 82, 83, 84];

    var buttons = [
        [41, 42, 43, 44, 57, 58, 59, 60],
        [73, 74, 75, 76, 89, 90, 91, 92]
    ];

    var navigation = {
        // cc numbers:
        up: 104,
        down: 105,
        left: 106,
        right: 107,
        // note numbers:
        device: 105,
        mute: 106,
        solo: 107,
        record: 108
    };

    var leds = [
        [13, 29, 45, 61, 77, 93, 109, 125],
        [14, 30, 46, 62, 78, 94, 110, 126],
        [15, 31, 47, 63, 79, 95, 111, 127]
    ];

    var Layout = [];

    for (var channel = 0; channel < 16; channel++)
    {
        Layout.push({
            encoders: encoders.map(function (row)
            {
                return row.map(function (number)
                {
                    return uint8ToHex(0xB0 | channel) + uint7ToHex(number) + '??';
                });
            }),
            leds: leds.map(function (row)
            {
                return row.map(function (number)
                {
                    return uint8ToHex(0x90 | channel) + uint7ToHex(number) + '??';
                });
            }),
            faders: faders.map(function (number)
            {
                return uint8ToHex(0xB0 | channel) + uint7ToHex(number) + '??';
            }),
            buttons: buttons.map(function (row)
            {
                return row.map(function (number)
                {
                    return uint8ToHex(0x90 | channel) + uint7ToHex(number) + '??';
                });
            }),
            navigation: {
                up: uint8ToHex(0xB0 | channel) + uint7ToHex(navigation.up) + '??',
                down: uint8ToHex(0xB0 | channel) + uint7ToHex(navigation.down) + '??',
                left: uint8ToHex(0xB0 | channel) + uint7ToHex(navigation.left) + '??',
                right: uint8ToHex(0xB0 | channel) + uint7ToHex(navigation.right) + '??',

                device: uint8ToHex(0x90 | channel) + uint7ToHex(navigation.device) + '??',
                mute: uint8ToHex(0x90 | channel) + uint7ToHex(navigation.mute) + '??',
                solo: uint8ToHex(0x90 | channel) + uint7ToHex(navigation.solo) + '??',
                record: uint8ToHex(0x90 | channel) + uint7ToHex(navigation.record) + '??'
            }
        });
    }

    return Layout;

})();

