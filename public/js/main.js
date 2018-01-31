n_projects=-1;
globalScrolled=0;
globalIsVisible=true;
redirectLanguage();
window.onload = function() {

    var bLazy = new Blazy({
       // Options
   });

   $(function () {
     var lastScrollTop = 0;
     var ARRIBA =1
     var ABAJO =0;
     var lastScrollDirection = ABAJO; //1
     var $navbar = $('.navbar');
      d = new Date();
      milliseconds = 0;
//https://code.luasoftware.com/tutorials/bootstrap/bootstrap4-navbar-hide-when-scroll-down/
   $(window).scroll(function(event){
       //console.log("scroll")

     var st = $(this).scrollTop();
     if (st > lastScrollTop && $(this).scrollTop()>30 ) { // scroll down
       if(lastScrollDirection==ARRIBA &&   ( ( Date.now()-milliseconds)>100)) {
           $navbar.fadeOut(500)
           milliseconds=Date.now()
       }
       lastScrollDirection=ABAJO;

     } else { // scroll up
       if(lastScrollDirection==ABAJO && ( ( Date.now()-milliseconds)>100))
        {
            $navbar.fadeIn(500)
            milliseconds=Date.now()
       }
       lastScrollDirection=ARRIBA;

     }

     lastScrollTop = st;
   });
 });

$('.language-switch').on('click',function(event){
    console.log("lang switch")
    Cookies.set('forceLang', 'yes',{ expires: 7 });
});
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




/*** bloque d3 datos **/
emptyData={
    codigo:0, intensidad:0, ocupacion:0, carga:0
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        globalIsVisible=false;
    } else {
        // page has focus, begin running task
        globalIsVisible=true;
        requestAnimationFrame(animate);
    }
});

d3.xml("public/data/pm_lite.xml", function(error, data) {
    if (error) throw error;
    //consigo un array de PMS
    //<accesoAsociado>\b.*.</accesoAsociado> eliminar contenidos en atom
    data_ayto = [].map.call(data.querySelectorAll("pm"), function(pm) {
        var acceso=""
    //    if(pm.querySelector("accesoAsociado")!=null ){
    //        acceso=pm.querySelector("accesoAsociado").textContent
    //    }
        return {
          codigo: pm.querySelector("codigo").textContent,
    //      accesoAsociado: acceso,
          intensidad: pm.querySelector("intensidad").textContent,
    //      ocupacion: pm.querySelector("ocupacion").textContent,
          carga: pm.querySelector("carga").textContent,
        };
      });
      datos_ayto_code=d3.nest().key(function(d){return d.codigo}).object(data_ayto);
      getPointsJson();

});

}

$( window ).resize(function() {

});

$(window).on("scroll", function(){
    globalScrolled = amountscrolled()
})
function amountscrolled(){
    var winheight = $(window).height()
    var docheight = $(document).height()
    var scrollTop = $(window).scrollTop()
    var trackLength = docheight - winheight
    var pctScrolled = scrollTop/trackLength  // gets percentage scrolled (ie: 80 NaN if tracklength == 0)
    return pctScrolled
}

cleanTrafico=[]

function getPointsJson(){
    d3.json("public/data/pmed_trafico_lite.geojson", function(error, trafico1) {
      if (error) return console.error(error);
      trafico=trafico1;
       originalTrafico = jQuery.extend(true, {}, trafico1);
      /** ESTE BLOQUE DE CODIGO LO USO PARA ELIMINAR CAMPOS QUE NO QUERÍA Y REDUCIR TAMANIO DE ARCHIVO
       for (var j=0; j< originalTrafico.features.length; j++){
           delete originalTrafico.features[j].properties["nombre"]
           delete originalTrafico.features[j].properties["tipo_elem"]
           originalTrafico.features[j].geometry.coordinates[0].splice(2)
       } **/
      generateMap();
      startThree();
      animate();
  });

}

function generateMap(){
    var width=1000, height=1000;
    //merge data
    cleanTrafico=[];
    var count=0;

    trafico.features.forEach(function(d){
        var code=d.properties.cod_cent;
    //    console.log(code)
        if ((code in datos_ayto_code)){
            d.rtdata=datos_ayto_code[code][0];
            if(d.rtdata.intensidad<0) return;

            if(! (count%4==0))
                cleanTrafico.push(d)
            count++
        }
        else return;
    })

    //trafico=cleanTrafico
    //geo1=d3.geoTransverseMercator().rotate([11.915,0,0]).fitSize([width-20, height-20]], trafico);
    geo1=d3.geoTransverseMercator().fitSize([width-20, height-20], trafico);
    for (var i=0; i<cleanTrafico.length; i++){
        var d= cleanTrafico[i];
    //    console.log(d)
        d.geo={}
        d.geo.x=geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [0] ;
        d.geo.y=geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [1] ;

    }
    //d3.max(clean)
    var color1 = d3.scaleLinear().domain([1, 2000]).range(["green", "red"]);


}


/*
Browser Language Redirect script- By JavaScript Kit
For this and over 400+ free scripts, visit http://www.javascriptkit.com
This notice must stay intact
*/
function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

function redirectLanguage(){
    if(Cookies.get('forceLang')=="yes" ) return; // si ha seleccionado a mano
    lang="en"
    if(window.location.pathname=="/") lang="en"
    else if(window.location.pathname=="/index_es.html") lang="es"
    else if(window.location.pathname=="/index_es") lang="es"
    //lang=getURLParameter('lang')
    if (lang!='es'){
          //Enter ISO 639-2 letter Language codes to detect (see: http://www.w3.org/WAI/ER/IG/ert/iso639.htm):
          var langcodes=new Array( "es","en", "default")

          //Enter corresponding redirect URLs (last one is for default URL):
          var langredirects=new Array( "index_es.html", "index.html","index.html")

          var languageinfo=navigator.language? navigator.language : navigator.userLanguage
          var gotodefault=1

          function redirectpage(dest){
          if (window.location.replace)
            window.location.replace(dest)
          else
            window.location=dest
          }

          for (i=0;i<langcodes.length-1;i++){
            if (languageinfo.substr(0,2)==langcodes[i]){
              if(langcodes[i]=="en"){
                  gotodefault=0
              }
              else{
                  redirectpage(langredirects[i])
                  gotodefault=0
                  break
              }
            }
          }
          if (gotodefault)
            redirectpage(langredirects[langcodes.length-1])
    }
}
