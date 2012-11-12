function Player (name)
{
    this.name       = name;
    this.life       = 40;
    this.poison     = 0;
    this.commander  = null;
    //this.history    = null;

    this.player_list = null;

    this.$interface = null;

    this.change_name_dialog = null;
    this.change_life_spinner = null;
    this.change_poison_spinner = null;
    this.change_commander_damage_spinner = null;
}

// freeze/thaw (to and from a JSON object)

Player.prototype.freeze = function ()
{
    var icicle = {
        'name'      : this.name,
        'life'      : this.life,
        'poison'    : this.poison,
        //'history'   : this.history
    };

    for (var i = 0; i < this.commander.length; i++)
        icicle['commander'+i] = this.commander[i];
}

Player.prototype.thaw = function (icicle)
{
    console.log('thaw1');

    this.name       = icicle.name;
    this.life       = icicle.life;
    this.poison     = icicle.poison;
    //this.history    = icicle.history;

    console.log('thaw2');

    this.commander = [];

    console.log('thaw3');

    var i = 0;
    while (true)
    {
        console.log('thaw4');

        if (icicle['commander'+i])
        {
            this.commander.push(parseInt(icicle['commander'+i]));

            i++;
        }
        else
        {
            break;
        }
    }

    console.log('thaw5');
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

Player.prototype.delta_commander = function (index, delta)
{
    this.delta_life(-1*delta);

    this.commander[index] += delta;

    if (this.$interface)
        this.$interface.find('div.commander[index='+index+'] div.damage').text(this.commander[index]);
}

Player.prototype.set_name = function (new_name)
{
    this.name = new_name;

    if (this.$interface)
        this.$interface.find('div.player > div.name').text(this.name);

    this.player_list.update_commander_names();
}

Player.prototype.update_commander_names = function ()
{
    if (this.$interface)
    {
        var $divs = this.$interface.find('.commander div');

        for (var i = 0; i < this.player_list.the_players.length; i++)
            $divs.eq(2*i).text(this.player_list.the_players[i].name);
    }
}

// dialogs

Player.prototype.init_mousedown = function ($el)
{
    $el.on('vmousedown', function () { $(this).addClass('down'); });
    $el.on('vmouseup', function () { $(this).removeClass('down'); });
}

Player.prototype.init_change_name_dialog = function ($el)
{
    var self = this;

    self.init_mousedown($el);

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

Player.prototype.init_change_life_spinner = function ($el)
{
    var self = this;

    this.init_mousedown($el);

    self.change_life_spinner = new Dialog();
    self.change_life_spinner.AdditionSpinner($el, function (delta) { self.delta_life(delta); });
}

Player.prototype.init_change_poison_spinner = function ($el)
{
    var self = this;

    this.init_mousedown($el);

    self.change_poison_spinner = new Dialog();
    self.change_poison_spinner.AdditionSpinner($el, function (delta) { self.delta_poison(delta); });
}

Player.prototype.init_change_commander_damage_spinner = function ($commander_wrapper)
{
    var self = this;

    self.init_mousedown($commander_wrapper);

    self.change_commander_damage_spinner = new Dialog();
    self.change_commander_damage_spinner.AdditionSpinner(
        $commander_wrapper.find('div.damage'),
        function (delta) {
            self.delta_commander(parseInt($commander_wrapper.attr('index')), delta);
        }
    );
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
    var $commander  = $('<div class="commander_damage"></div>');
    //var $history    = $('<div class="history"></div>');

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
            this.commander.push(0);

            var $commander_wrapper = $('<div class="commander" index="'+i+'"></div>');
            var $commander_name = $('<div class="name">'+this.player_list.the_players[i].name+'</div>');
            var $commander_damage = $('<div class="damage">'+this.commander[i]+'</div>');

            $commander_wrapper.append($commander_name, $commander_damage);

            $commander.append($commander_wrapper);

            this.init_change_commander_damage_spinner($commander_wrapper);
        }

        //$history.text(this.history);

    // glue and return
    this.$interface = $('<div class="player_wrapper"></div>').append(
        $i.append(
            $name,
            $('<div class="life_poison"></div>').append(
                $life,
                $poison
            ),
            $('<div class="clear"></div>'),
            $commander
            //$history
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
    {
        this.change_name_dialog.destroy();
        this.change_name_dialog = null;
    }

    if (this.change_life_spinner)
    {
        this.change_life_spinner.destroy();
        this.change_life_spinner = null;
    }

    if (this.change_poison_spinner)
    {
        this.change_poison_spinner.destroy();
        this.change_poison_spinner = null;
    }
}

