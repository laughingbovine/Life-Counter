function Player (name)
{
    this.name       = name;
    this.life       = 40;
    this.poison     = 0;
    this.commander  = 'commander';
    this.history    = 'history';

    this.$interface = null;

    this.change_name_dialog = null;
    this.change_life_spinner = null;
}

// accessors

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
        // load data
        $name.text(this.name);
        $life.text(this.life);
        $poison.text(this.poison);
        $commander.text(this.commander);
        $history.text(this.history);

        // change name dialog
        this.init_change_name_dialog($name);
        this.init_change_life_spinner($life);
        this.init_change_poison_spinner($poison);

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
