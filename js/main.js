n_projects=-1;
window.onload = function() {


    $('#showmore').on('click',function(event){
        event.preventDefault();
        $("#moreprojects").show();
        setCardSizes()
    })
    renderProjects();

}

$( window ).resize(function() {
    setCardSizes();
});

function afterLoading(){
    if(n_projects==0){
        console.log("after loading ok")
        $('.card-container').on('click',function(){$(this).toggleClass('hover') })
        setCardSizes();
    }
}

function setCardSizes(){
    $('.card .front, .card .back').each(function(){
        console.log($(this))
        var h= $(this).children('.image-prj').css('height')
        $(this).css('height',h );
        $(this).parent().css('height',h );
    })
}

function renderProjects(){
    $.getJSON( "data/projects.json", function( data ) {
      var cnt_main=0;
      var cnt_extra=0;
      n_projects=Object.keys(data).length;

      $.each( data, function( key, val ) {
          console.log(key)

          if("extra" in val){
            if(cnt_extra%2==0) val.firstColumn=true;
            my.utils().renderExtTemplate({ name: 'project', selector: '#moreprojects', data: val })
            cnt_extra++;
        }else{
            if(cnt_main%2==0) val.firstColumn=true;
            my.utils().renderExtTemplate({ name: 'project', selector: '#coverprojects', data: val })
            cnt_main++;
        }

      });

    });

}


var my = my || {};
my.utils = (function() {
    var getPath = function(name) {
        return 'templates/' + name + '.tmpl.html';
    },
    renderExtTemplate = function(item) {
        var file = getPath( item.name );
        $.when($.get(file))
         .done(function(tmplData) {
             n_projects--;
             var tmpl= $.templates( tmplData );
             var rendered=tmpl.render(item.data)
             $(item.selector).append(rendered);
              //setCardSizes();
              afterLoading();
         });
    };

    return {
        getPath: getPath,
        renderExtTemplate: renderExtTemplate
    };
});
