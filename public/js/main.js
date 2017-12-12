n_projects=-1;
window.onload = function() {
    $('#prj_list').on('click',"#showmore",function(event){
        event.preventDefault();
        $("#moreprojects-container").addClass('show');
        $(this).attr("id","showless")
        $(this).html("Ocultar")
    })

    $('#prj_list').on('click', "#showless",function(event){
        event.preventDefault();
        $("#moreprojects-container").removeClass('show');
        $(this).attr("id","showmore")
        $(this).html("Mostrar más")
    })


}

$( window ).resize(function() {

});
