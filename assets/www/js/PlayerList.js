// constructor

function PlayerList ()
{
    this.the_players = null;
}

// constructor - part 2 (called manually)
// not really sure how to do this (multiple constructors) the "correct" way in JS

PlayerList.prototype.new_game = function (num_players, old_list)
{
    //console.log('PlayerList::new_game()');

    if (old_list)
        old_list.end_game();

    this.the_players = new Array();

    for (var i = 0; i < num_players; i++)
    {
        var p;

        if (old_list && old_list.the_players && old_list.the_players[i]) // maintain old names
            p = new Player(old_list.the_players[i].name);
        else
            p = new Player("Player "+(i+1));

        p.new_game(num_players, this);

        this.the_players.push(p);
    }
}

PlayerList.prototype.thaw = function ()
{
    this.the_players = new Array();

    var i = 0;

    while (true)
    {
        var key = 'Life.player.'+i;
        var icicle_string = localStorage.getItem(key);

        //console.log('thawing icicle: (key: '+key+') '+icicle_string);

        if (icicle_string)
        {
            var p = new Player();

            p.thaw(JSON.parse(icicle_string), this);

            this.the_players.push(p);

            i++;
        }
        else
        {
            break;
        }
    }
}

// couterpart to thaw()

PlayerList.prototype.freeze = function ()
{
    for (var i = 0; i < this.the_players.length; i++)
    {
        var key = 'Life.player.'+i;
        var icicle_string = JSON.stringify(this.the_players[i].freeze());

        //console.log('freezing icicle: (key: '+key+') '+icicle_string);

        localStorage.setItem(key, icicle_string);
    }
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
