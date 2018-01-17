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


/*** bloque d3 datos **/
emptyData={
    codigo:0, intensidad:0, ocupacion:0, carga:0
}

d3.xml("public/data/pm.xml", function(error, data) {
    if (error) throw error;
    //consigo un array de PMS

    data_ayto = [].map.call(data.querySelectorAll("pm"), function(pm) {
        var acceso=""
        if(pm.querySelector("accesoAsociado")!=null ){
            acceso=pm.querySelector("accesoAsociado").textContent
        }
        return {
          codigo: pm.querySelector("codigo").textContent,
          accesoAsociado: acceso,
          intensidad: pm.querySelector("intensidad").textContent,
          ocupacion: pm.querySelector("ocupacion").textContent,
          carga: pm.querySelector("carga").textContent,
        };
      });
      datos_ayto_code=d3.nest().key(function(d){return d.codigo}).object(data_ayto);
      getPointsJson();

});

}

$( window ).resize(function() {

});



cleanTrafico=[]

function getPointsJson(){
    d3.json("public/data/pmed_trafico.geojson", function(error, trafico1) {
      if (error) return console.error(error);
      trafico=trafico1;
      generateMap();
      startThree();
      animate();
  });

}

function generateMap(){
    var width=1000, height=1000;
    //merge data
    cleanTrafico=[];

    trafico.features.forEach(function(d){
        var code=d.properties.cod_cent;
    //    console.log(code)
        if ((code in datos_ayto_code)){
            d.rtdata=datos_ayto_code[code][0];
            if(d.rtdata.intensidad<0) return;
            cleanTrafico.push(d)
        }
        else return;
    })
    //trafico=cleanTrafico
    //geo1=d3.geoTransverseMercator().rotate([11.915,0,0]).fitSize([width-20, height-20]], trafico);
    geo1=d3.geoTransverseMercator().fitSize([width-20, height-20], trafico);

    for (var i=0; i<cleanTrafico.length; i++){
        var d= cleanTrafico[i];
        d.geo={}
        d.geo.x=geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [0] ;
        d.geo.y=geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [1] ;

    }
    //d3.max(clean)
    var color1 = d3.scaleLinear().domain([1, 2000]).range(["green", "red"]);

    /*svg.selectAll(".estaciones")
        .data( cleanTrafico)
        .enter()
        .append("svg:circle")
        .attr('class',"estaciones")
        .attr('id',function(d){
            return "pm_" + d.properties.cod_cent + ".xml"
        })
        .attr("r",function(d){
            return 2;
        })
        .attr("cx",width/2).attr("cy",height/2)
        //.transition().duration(2000)
        .attr("cx", function(d){return geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [0]   })
        .attr("cy", function(d){return geo1([d.geometry.coordinates[0][0][0],d.geometry.coordinates[0][0][1]]) [1]   })
        .style("fill", function(d){    return color1(d.rtdata.intensidad)        }) //colorea segun acceso asociado*/
        /*.style("fill", function(d){ if(d.properties.tipo_elem=="PUNTOS MEDIDA M-30")
                          return "rgba(255,0,0,0.8)";
                                      else return "rgba(0,255,0,0.8)";
      })*/


     
}


/*
Browser Language Redirect script- By JavaScript Kit
For this and over 400+ free scripts, visit http://www.javascriptkit.com
This notice must stay intact

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

lang=getURLParameter('lang')
if (lang!='es'){
      //Enter ISO 639-2 letter Language codes to detect (see: http://www.w3.org/WAI/ER/IG/ert/iso639.htm):
      var langcodes=new Array("en", "es", "default")

      //Enter corresponding redirect URLs (last one is for default URL):
      var langredirects=new Array("index.html", "index_es.html", "index.html")

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
          if(langcodes[i]=="es"){gotodefault=0}
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
*/
