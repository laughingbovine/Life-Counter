function calculate_spin_magnitude (coords, last_coords)
{
    // quadrant?
    //  y
    // x+-----------
    //  |     |
    //  | II  |  I
    //  |     |
    //  |-----c-----
    //  |     |
    //  | III | IV
    //  |     |

    // requirements for positive movement (clockwise)
    // (the opposite for negative movement)
    // I    - +x, +y
    // II   - +x, -y
    // III  - -x, -y
    // IV   - -x, +y

    var delta = { 'x' : coords.x - last_coords.x, 'y' : coords.y - last_coords.y };

    var magnitude = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

    if (coords.x > 0)
    {
        if (coords.y > 0)
        {
            // IV
            if (delta.x >= 0 && delta.y <= 0) // negative
                magnitude *= -1;
            else if (!(delta.x <= 0 && delta.y >= 0)) // not positive
                magnitude = 0;
        }
        else
        {
            // I
            if (delta.x <= 0 && delta.y <= 0) // negative
                magnitude *= -1;
            else if (!(delta.x >= 0 && delta.y >= 0)) // not positive
                magnitude = 0;
        }
    }
    else
    {
        if (coords.y > 0)
        {
            // III
            if (delta.x >= 0 && delta.y >= 0) // negative
                magnitude *= -1;
            else if (!(delta.x <= 0 && delta.y <= 0)) // not positive
                magnitude = 0;
        }
        else
        {
            // II
            if (delta.x <= 0 && delta.y >= 0) // negative
                magnitude *= -1;
            else if (!(delta.x >= 0 && delta.y <= 0)) // not positive
                magnitude = 0;
        }
    }

    return magnitude;
}

/******************************************************************************/

function Dialog ($template, options)
{
    this.exists     = false;
    this.showing    = false;
    this.$template  = $template;
    this.$dialog    = null;
    this.$backdrop  = null;

    this.hooks = {
        'create'    : [],
        'show'      : [],
        'hide'      : [],
        'destroy'   : []
    };

    // defaults
    this.options = {
        'backdrop'  : true
    };

    for (var o in options)
        if (this.options[o])
            this.options[o] = options[o];
}

// the basic functions

Dialog.prototype.create = function ()
{
    if (this.exists)
        return;

    this.exists = true;

    this.$dialog = $('<div class="dialog"></div>').addClass(this.$template.attr('class')).append(this.$template.contents().clone(true));
    this.$backdrop = $('<div class="dialog_backdrop"></div>').append(this.$dialog);

    // TODO: clicks on the backdrop should cancel the dialog
    //this.$backdrop.on('vmousedown', this.hide);

    $('body').append(this.$backdrop);

    this.call_hooks('create');
}

Dialog.prototype.show = function ()
{
    if (this.showing)
        return;

    if (!this.exists)
        this.create();

    this.showing = true;

    this.$backdrop.show();
    this.$dialog.show();

    // center
    this.$dialog.css({
        'margin-top':(this.$dialog.outerHeight()/-2)+'px',
        'margin-left':(this.$dialog.outerWidth()/-2)+'px'
    });

    this.call_hooks('show');
}

Dialog.prototype.hide = function ()
{
    if (!this.showing)
        return;

    this.showing = false;

    this.$backdrop.hide();
    this.$dialog.hide();

    this.call_hooks('hide');
}

Dialog.prototype.destroy = function ()
{
    if (!this.exists)
        return;

    if (this.showing)
        this.hide();

    this.exists = false;

    this.$backdrop.remove();

    this.$backdrop = null;
    this.$dialog = null;

    this.call_hooks('destroy');
}

// hooks
Dialog.prototype.on = function (hook_name, callback)
{
    if (this.hooks[hook_name])
        this.hooks[hook_name].push(callback);
}

Dialog.prototype.call_hooks = function (hook_name)
{
    if (this.hooks[hook_name])
        for(var i = 0; i < this.hooks[hook_name].length; i++)
            this.hooks[hook_name][i].call(this);
}

// recipies
Dialog.prototype.Spinner = function ($trigger, show_callback, spin_callback, final_callback)
{
    var self = this;

    var total_magnitude;
    var last_coords;
    var center;

    var event_move = function (e)
    {
        e.preventDefault(); // spinning only, no scrolling

        // Note: coords are relative
        var coords = { 'x' : e.pageX - center.x, 'y' : e.pageY - center.y };

        if (last_coords)
        {
            total_magnitude += calculate_spin_magnitude(coords, last_coords);

            spin_callback.call(self, total_magnitude);
        }

        last_coords = coords;
    }

    var event_up = function ()
    {
        self.hide();

        $(document).off('vmousemove.spinner', event_move);
    }

    self.on('show', function () {
        // recalculate the center for spinning later on
        var offset = self.$dialog.offset();
        var w = self.$dialog.innerWidth();
        var h = self.$dialog.innerHeight();

        center = { 'x' : offset.left + (w / 2), 'y' : offset.top + (h / 2) };

        // reset our "global" variables
        last_coords = null;
        total_magnitude = 0;

        show_callback.call(self);
    });

    $trigger.on('vmousedown', function () {
        // show the dialog
        self.show();

        // on mouse move, do some "spin magnitude" calculation and update the dialog accordingly
        $(document).on('vmousemove.spinner', event_move);

        // on mouse up, hide the dialog, remove the other mouse events, and update the actual life total
        $(document).one('vmouseup.spinner', function () {
            self.hide();

            $(document).off('vmousemove.spinner', event_move);

            final_callback.call(self);
        });
    });
}

Dialog.prototype.AdditionSpinner = function ($trigger, callback)
{
    var self = this;

    var initial;
    var change;

    this.$template = $('div._addition_spinner.template');

    // change the backdrop so that it's 100% transparent instead of opaque
    // TODO: make it only 50% transparent?
    self.on('create', function () {
        self.$backdrop.css('background-color', 'transparent');
    });

    // set this Dialog up as a "Spinner"
    self.Spinner(
        // the trigger
        $trigger,
        // on show
        function () {
            initial = parseInt($trigger.text());
            change = 0;

            self.$dialog.find('span.initial').text(initial);
            self.$dialog.find('span.operator').text('+').css('color', '');
            self.$dialog.find('span.change').text('0').css('color', '');
            self.$dialog.find('span.final').text(initial).css('color', '');
        },
        // on spin
        function (total_magnitude) {
            change = Math.round(total_magnitude / 150);

            if (change > 0)
            {
                self.$dialog.find('span.operator').text('+').css('color', 'green');
                self.$dialog.find('span.change').text(change).css('color', 'green');
                self.$dialog.find('span.final').css('color', 'green');
            }
            else if (change < 0)
            {
                self.$dialog.find('span.operator').text('-').css('color', 'red');
                self.$dialog.find('span.change').text(change * -1).css('color', 'red');
                self.$dialog.find('span.final').css('color', 'red');
            }
            else // change == 0
            {
                self.$dialog.find('span.operator').text('+').css('color', '');
                self.$dialog.find('span.change').text(change).css('color', '');
                self.$dialog.find('span.final').css('color', '');
            }

            self.$dialog.find('span.final').text(initial + change);
        },
        // finally
        function () {
            callback.call(this, change);
        }
    );
}
