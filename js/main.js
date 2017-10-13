
window.onload = function() {
    $('.card-container').on('click',function(){$(this).toggleClass('hover') })

    $('#showmore').on('click',function(event){
        event.preventDefault();
    })
    setCardSizes();
}

$( window ).resize(function() {
    setCardSizes();
});

function setCardSizes(){
    $('.card .front, .card .back').each(function(){
        console.log($(this))
        var h= $(this).children('.image-prj').css('height')
        $(this).css('height',h );
        $(this).parent().css('height',h );
    })
}
