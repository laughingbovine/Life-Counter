function init ()
{
    //// some blanket stuff to make things easier
    //$('button').on('vmousedown', function () { console.log('down'); $(this).addClass("down"); });
    //$('button').on('vmouseup', function () { console.log('up'); $(this).removeClass("down"); });
}

$(document).on('pageinit', init);
