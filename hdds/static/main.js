
function block_unwanted_symbol()
{
    var e=event||window.event;
    var key=e.keycode||e.which;
    if(key==220||key==222)
    {
        if(e.preventDefault)
            e.preventDefault();
        e.returnValue=false;
    }
}

