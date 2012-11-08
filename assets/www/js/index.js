var players;
var new_game_dialog;

function init_new_game_dialog ()
{
    var $tmpl = $('div._new_game.template');

    new_game_dialog = new Dialog($tmpl);

    new_game_dialog.on('create', function () {
        this.$dialog.find('button').on('click', function () {
            var num_players = parseInt($(this).attr("value"));
            
            $("#page #boards").empty();
            players = new Array();

            for (var i = 0; i < num_players; i++)
            {
                var player = new Player("Player "+(i+1));

                players.push(player);

                $("#page #boards").append(player.construct_interface());
            }

            new_game_dialog.hide();
        });
    });

    $('button._new_game').on('click', function () { 
        //navigator.notification.alert(
        //    'You are the winner!',  // message
        //    function () {},         // callback
        //    'Game Over',            // title
        //    'Done'                  // buttonName
        //);

        new_game_dialog.show();
    });
}

function index ()
{
    init_new_game_dialog();

    //$("#new_game").on('click', function () {
    //    var num_players = parseInt($(this).attr("value"));
    //    
    //    $("#home #boards").empty();
    //    players = new Array();

    //    for (var i = 0; i < num_players; i++)
    //    {
    //        var player = new Player("Player "+(i+1));

    //        players.push(player);

    //        $("#home #boards").append(player.construct_interface());
    //    }

    //    $('#new_game').dialog('close');
    //});
}

$(document).on('ready', index);
