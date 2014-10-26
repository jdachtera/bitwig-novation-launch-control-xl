loadAPI(1);

host.defineController("Novation", "Launch Control XL", "1.0", "94793080-55fb-11e4-8ed6-0800200c9a66");
host.defineMidiPorts(1, 1);
host.defineSysexIdentityReply('F0 7E 00 06 02 00 20 29 61 00 00 00 00 00 03 06 F7');

load('src/index.js');
load('Colors.js');
load('Layout.js');
load('LaunchControlXL.js');

var main;

function init()
{
    var noteInput = host.getMidiInPort(0).createNoteInput("Launchpad", "80????", "90????");
    noteInput.setShouldConsumeEvents(false);

    var port = new MidiPort(host, 0);

    var launchControlXL = new LaunchControlXL();

    main = new ControlGroup([launchControlXL]);
    main.set('midiPort', port);

    port.on('sysex', function (data)
    {
        if (data.matchesHexPattern('F0 00 20 29 02 11 77 ?? F7'))
        {
            var program = data.hexByteAt(7);
            launchControlXL.set('active', program === 8);
        }
    });

}

function exit()
{
    main.onExit();
}



