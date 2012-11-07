function Player (name, life)
{
    console.log("Player constructor");

    this.name       = name;
    this.life       = life;
    this.poison     = 'poison';
    this.general    = 'general';
    this.history    = 'history';
}

Player.prototype.construct_interface = function ()
{
    // set up needed elements
    var $i          = $('<div class="player"></div>');

    var $name       = $('<div class="name"></div>');
    var $life       = $('<div class="life"></div>');
    var $poison     = $('<div class="poison"></div>');
    var $general    = $('<div class="general"></div>');
    var $history    = $('<div class="history"></div>');

    // actual ui stuff
    $name.text(this.name);
    $life.text(this.life);
    $poison.text(this.poison);
    $general.text(this.general);
    $history.text(this.history);

    // glue and return
    return $('<div class="player_wrapper"></div>').append(
        $i.append(
            $name,
            $life,
            $poison,
            $general,
            $history
    ));
}
