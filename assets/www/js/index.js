var players;

function index ()
{
    $("#new_game button").on('click', function () {
        var num_players = parseInt($(this).attr("value"));
        
        $("#home #boards").empty();
        players = new Array();

        for (var i = 0; i < num_players; i++)
        {
            var player = new Player("Player "+(i+1), 40);

            players.push(player);

            $("#home #boards").append(player.construct_interface());
        }

        $('#new_game').dialog('close');
    });
}

$(document).on('pageinit', index);
