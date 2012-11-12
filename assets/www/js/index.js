// globals

var players;
var new_game_dialog;

// some essential events

function freeze ()
{
    localStorage.clear();

    if (players)
        players.freeze();
}

function thaw ()
{
    players = new PlayerList();
    players.thaw();
    players.update_interface();
}

function back ()
{
    freeze();

    navigator.app.exitApp();
}

// game logic

function init_new_game_dialog ()
{
    var $tmpl = $('div._new_game.template');

    new_game_dialog = new Dialog($tmpl);

    new_game_dialog.on('create', function () {
        this.$dialog.find('button').on('click', function () {
            if ($(this).attr('value') == 'cancel')
            {
                new_game_dialog.hide();
            }
            else
            {
                var old_players = players;
                var num_players = parseInt($(this).attr('value'));

                players = new PlayerList();

                players.new_game(num_players, old_players);

                players.update_interface();

                new_game_dialog.hide();
            }
        });
    });

    $('button._new_game').on('click', function () { 
        new_game_dialog.show();
    });
}

// starting point

document.addEventListener(
    'deviceready',
    function () {
        console.log('ready');

        // some blanket stuff to make things easier
        $('button').on('vmousedown', function () { $(this).addClass('down'); });
        $('button').on('vmouseup', function () { $(this).removeClass('down'); });

        //$('input').on('focus', function () { this.select(); });

        // handle freeze, thaw, and back
        document.addEventListener('pause', freeze, false);
        document.addEventListener('resume', thaw, false);
        document.addEventListener('backbutton', back, false);

        // init new game dialog =)
        init_new_game_dialog();

        // thaw last session
        thaw();
    },
    false
);
