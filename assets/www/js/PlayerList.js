// constructor

function PlayerList ()
{
    this.the_players = null;
}

// constructor - part 2 (called manually)
// not really sure how to do this (multiple constructors) the "correct" way in JS

PlayerList.prototype.new_game = function (num_players, old_list)
{
    if (old_list)
        old_list.end_game();

    this.the_players = new Array();

    for (var i = 0; i < num_players; i++)
    {
        if (old_list && old_list.the_players && old_list.the_players[i]) // maintain old names
            this.the_players.push(new Player(old_list.the_players[i].name));
        else
            this.the_players.push(new Player("Player "+(i+1)));
    }

    this.link_players_to_player_list();
}

PlayerList.prototype.thaw = function ()
{
    this.the_players = new Array();

    var i = 0;

    while (true)
    {
        var icicle = localStorage.getItem('Life.player.'+i);

        if (icicle)
        {
            this.the_players.push(new Player());

            this.the_players[i].thaw(JSON.parse(icicle));

            i++;
        }
        else
        {
            break;
        }
    }

    this.link_players_to_player_list();
}

// constructor - part 3 (called from part 2)

PlayerList.prototype.link_players_to_player_list = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
        this.the_players[i].set_player_list(this);
}

// couterpart to thaw()

PlayerList.prototype.freeze = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
        localStorage.setItem('Life.player.'+i, JSON.stringify(this.the_players[i].freeze()));
}

// update various parts of the interface (or just the whole thing)

PlayerList.prototype.update_interface = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
        this.the_players[i].destruct_interface();

    $('#page #boards').empty(); // just in case

    for (var i = 0; i < this.the_players.length; i++)
        $('#page #boards').append(this.the_players[i].construct_interface());
}

PlayerList.prototype.update_commander_names = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
        this.the_players[i].update_commander_names();
}

// tear down the interfaces

PlayerList.prototype.end_game = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
        this.the_players[i].destruct_interface();
}
