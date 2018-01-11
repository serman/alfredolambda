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
