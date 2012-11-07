function Dialog (contents)
{
    this.exists = false;
    this.showing = false;
    this.contents = contents;
    this.$d = null;
}

Dialog.prototype.create = function ()
{
    this.exists = true;

    this.$d = $('<div class="dialog"></div>').append(this.contents);

    $('div.page').append(this.$d);

    // center
    this.$d.css({
        'margin-top':(this.$d.outerHeight()/-2)+'px',
        'margin-left':(this.$d.outerWidth()/-2)+'px'
    });
}

Dialog.prototype.show = function ()
{
    if (this.showing)
        return;

    if (!this.exists)
        this.create();

    this.showing = true;
    this.$d.show();
}

Dialog.prototype.hide = function ()
{
    if (!this.showing)
        return;

    this.showing = false;
    this.$d.hide();
}

Dialog.prototype.destroy = function ()
{
    if (!this.exists)
        return;

    if (this.showing)
        this.hide();

    this.exists = false;

    this.$d.remove();

    this.$d = null;
}
