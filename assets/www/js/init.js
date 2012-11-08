function init ()
{
    // some blanket stuff to make things easier
    $('button').on('vmousedown', function () { $(this).addClass("down"); });
    $('button').on('vmouseup', function () { $(this).removeClass("down"); });

    //$('input').on('focus', function () { this.select(); });
}

$(document).on('ready', init);
