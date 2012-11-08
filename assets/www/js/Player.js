function Player (name)
{
    this.name       = name;
    this.life       = 40;
    this.poison     = 0;
    this.commander  = null;
    this.history    = null;

    this.player_list = null;

    this.$interface = null;

    this.change_name_dialog = null;
    this.change_life_spinner = null;
    this.change_poison_spinner = null;
}

// freeze/thaw (to and from a JSON object)

Player.prototype.freeze = function ()
{
    return {
        'name'      : this.name,
        'life'      : this.life,
        'poison'    : this.poison,
        'commander' : this.commander,
        'history'   : this.history
    }
}

Player.prototype.thaw = function (icicle)
{
    this.name       = icicle.name;
    this.life       = icicle.life;
    this.poison     = icicle.poison;
    this.commander  = icicle.commander;
    this.history    = icicle.history;
}

// accessors

Player.prototype.set_player_list = function (player_list)
{
    this.player_list = player_list;
}

Player.prototype.delta_life = function (delta)
{
    this.life += delta;

    if (this.$interface)
        this.$interface.find('div.life').text(this.life);
}

Player.prototype.delta_poison = function (delta)
{
    this.poison += delta;

    if (this.$interface)
        this.$interface.find('div.poison').text(this.poison);
}

Player.prototype.set_name = function (new_name)
{
    this.name = new_name;

    if (this.$interface)
        this.$interface.find('div.name').text(this.name);
}

Player.prototype.update_commander_names = function ()
{
    if (this.$interface)
    {
        for (var i = 0; i < this.commander.length; i++)
    }
}

// dialogs

Player.prototype.init_change_life_spinner = function ($el)
{
    var self = this;

    self.change_life_spinner = new Dialog();
    self.change_life_spinner.AdditionSpinner($el, function (delta) { self.delta_life(delta); });
}

Player.prototype.init_change_poison_spinner = function ($el)
{
    var self = this;

    self.change_poison_spinner = new Dialog();
    self.change_poison_spinner.AdditionSpinner($el, function (delta) { self.delta_poison(delta); });
}

Player.prototype.init_change_name_dialog = function ($el)
{
    var self = this;

    var d = new Dialog($('div._name_change.template'));

    self.change_name_dialog = d

    d.on('create', function () {
        d.$dialog.find('button:contains(OK)').on('click', function () {
            self.set_name(d.$dialog.find('input').val());

            d.hide();
        });

        d.$dialog.find('input').on('keypress', function (e) {
            if (e.which == 13)
            {
                self.set_name(d.$dialog.find('input').val());

                d.hide();
            }
        });

        d.$dialog.find('button:contains(Cancel)').on('click', function () {
            d.hide();
        });
    });

    d.on('show', function () {
        d.$dialog.find('input').val(self.name);
        d.$dialog.find('input').focus();
    });

    $el.on('click', function () {
        d.show();
    });
}

// the interface

Player.prototype.construct_interface = function ()
{
    if (this.$interface)
        return this.$interface;

    // set up needed elements
    var $i          = $('<div class="player"></div>');

    var $name       = $('<div class="name"></div>');
    var $life       = $('<div class="life"></div>');
    var $poison     = $('<div class="poison"></div>');
    var $commander  = $('<div class="commander"></div>');
    var $history    = $('<div class="history"></div>');

    // actual ui stuff
        // load data, init dialogs
        $name.text(this.name);
        this.init_change_name_dialog($name);

        $life.text(this.life);
        this.init_change_life_spinner($life);

        $poison.text(this.poison);
        this.init_change_poison_spinner($poison);

        //$commander.text(this.commander);
        this.commander = new Array();
        for (var i = 0; i < this.player_list.the_players.length; i++)
        {
            var classname = 'player'+i;

            this.commander.push(0);

            $commander.append($('<div class="name">'+this.player_list.the_players[i].name+'</div><div class="damage">'+this.commander[i]+'</div>'));
        }

        $history.text(this.history);

    // glue and return
    this.$interface = $('<div class="player_wrapper"></div>').append(
        $i.append(
            $name,
            $('<div class="life_poison"></div>').append(
                $life,
                $poison
            ),
            $('<div class="clear"></div>'),
            $commander,
            $history
    ));

    return this.$interface;
}

Player.prototype.destruct_interface = function ()
{
    if (this.$interface)
    {
        this.$interface.remove();
        this.$interface = null;
    }

    if (this.change_name_dialog)
        this.change_name_dialog.destroy();

    if (this.change_life_spinner)
        this.change_life_spinner.destroy();

    if (this.change_poison_spinner)
        this.change_poison_spinner.destroy();
}

