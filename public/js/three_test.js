var MAX_SPEED= 3.0
var MAX_STEER= 0.3
var cursorX=0;
var cursorY=0;
var targetPositions=[];

status=1;
document.onmousemove = function(e){
    cursorX = e.pageX-(window.innerWidth/2);
    cursorY = e.pageY-$('canvas').position().top- (window.innerHeight/2);
    ddd=e;
}

function startThree() {
    maxGeoX= d3.max(cleanTrafico, function(d){ return d.geo.x})
    maxGeoY= d3.max(cleanTrafico, function(d){ return d.geo.y})
    minGeoX= d3.min(cleanTrafico, function(d){ return d.geo.x})
    minGeoY= d3.min(cleanTrafico, function(d){ return d.geo.y})
    targetPositions.push(new THREE.Vector3(-300,-300,-800))
    targetPositions.push(new THREE.Vector3(-200,-800,-300))
    targetPositions.push(new THREE.Vector3(-200,-600,-300))
    //ofVec3f& a_target, bool a_slowdown, float a_scale, float a_minDist
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    //controls = new THREE.OrbitControls( camera );
    camera.position.z = -1000;
    camera.position.y = -1000;
    camera.position.x=-300
    camera.lookAt(0,0,0)
    //camera.position.y=170
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000, 1);
    document.body.appendChild(renderer.domElement);

    /*** add steer to vector 3 ***/
    THREE.Vector3.prototype.velocity=new THREE.Vector3(0,0,0);
    THREE.Vector3.prototype.acceleration=new THREE.Vector3(0,0,0);
    THREE.Vector3.prototype.steer=function(a_target,  a_slowdown,  a_scale,  a_minDist ) {
            _steer=new THREE.Vector3()
           var desired = new THREE.Vector3( a_target.x - this.x , a_target.y-this.y, a_target.z-this.z)

           var d = desired.length();

           // If the distance is greater than 0, calc _steering (otherwise return zero vector)
           if (d > 0) {
               //console.log(d)

               desired.normalize();

               if(a_minDist == 0) a_slowdown = false;
               // Two options for desired vector magnitude (1 -- based on distance, 2 -- maxspeed)
               if ((a_slowdown) && (d < a_minDist)) {
                   desired.multiplyScalar( (MAX_SPEED * (d/a_minDist)) )
                   } // This damping is somewhat arbitrary
               else {desired.multiplyScalar(MAX_SPEED); }

               _steer.set(desired.x - this.velocity.x,desired.y - this.velocity.y,desired.z - this.velocity.z);
               _steer.clampScalar(-MAX_STEER,MAX_STEER); //solo me interesa limite por arriba
               _steer.multiplyScalar(a_scale);
               aa=_steer;
               bb=desired
           } else {
               _steer.set(0, 0, 0);
           }

           this.acceleration.x+= _steer.x
           this.acceleration.y+= _steer.y
           this.acceleration.z+= _steer.z
       }

    THREE.Vector3.prototype.update=function (){
       this.velocity.add(this.acceleration);
       this.add(this.velocity);
       //aa=this.acceleration;
       //console.log(this.acceleration[0])
       this.acceleration.x=0;
       this.acceleration.y=0;
       this.acceleration.z=0;
    }

/************** MATERIAL PARTICULAS *******/
    //sistema de particulas
    // create the particle variables
    var pMaterialStations = new THREE.PointsMaterial({
        color: 0x22FF22,
        size: 10,
        map: new THREE.TextureLoader().load(
            "public/images/circle.png"

        ),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false
    });
    pMaterialStations.opacity=0.3

/// MATERIAL INTENSIDAD
    pMaterialIntensity=pMaterialStations.clone()
    pMaterialIntensity.color=new THREE.Color(0xFFFFFF);
    pMaterialIntensity.size=6;


// PARTICLE SYSTEMS
    particleCountStations=cleanTrafico.length
    particleCountIntensity=Math.round(d3.sum(cleanTrafico, function(d){ return d.rtdata.intensidad})/100)

    var particlesStationsGeo = new THREE.Geometry();
    for (var p = 0; p < particleCountStations; p++) {
        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 1000 - 500,
            pY = Math.random() * 1000 - 500,
            pZ = 0,
            particle =  new THREE.Vector3(pX, pY, pZ)
            particlesStationsGeo.vertices.push(particle);

    }
     particleSystemStations = new THREE.Points(
        particlesStationsGeo,
        pMaterialStations);
    particleSystemStations.geometry.dynamic = true;


    /**********************************************************/
    var particlesIntensityGeo = new THREE.Geometry();
    for (var p = 0; p < particleCountIntensity; p++) {
        // create a particle with random
        // position values, -250 -> 250
        var pX = Math.random() * 1000 - 500,
            pY = Math.random() * 1000 - 500,
            pZ = 0,
            particle =  new THREE.Vector3(pX, pY, pZ)
            particlesIntensityGeo.vertices.push(particle);

    }
     particleSystemIntensity = new THREE.Points(
        particlesIntensityGeo,
        pMaterialIntensity);
    particleSystemIntensity.geometry.dynamic = true;

    // also update the particle system to
    // sort the particles which enables
    // the behaviour we want
//    particleSystem.sortParticles = true;

    // add it to the scene
    scene.add(particleSystemStations);
    scene.add(particleSystemIntensity);



/**********LINES ************/
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent:true, linewidth: 1 });
    lineMaterial.blending= THREE.AdditiveBlending
    lineMaterial.opacity=0.05;
    var geometry1 = new THREE.Geometry();
    var i=0, j=0;
    for (var i = 0; i < cleanTrafico.length; i++)
    {
        geometry1.vertices.push(particleSystemStations.geometry.vertices[i]);
    }

    line = new THREE.Line(geometry1, lineMaterial);
    line.geometry.dynamic = true;


    geometry1.verticesNeedUpdate=true
    scene.add(line)

} //fin startThree

function animate() {

    if(globalScrolled<0.3) status=0
    else status=1
    particleSystemIntensity.material.opacity=globalScrolled/2.5
    //if(status==0) particleSystemIntensity.material.opacity=0
    //if(status==1) particleSystemIntensity.material.opacity=0.4

       for (var i = 0; i < cleanTrafico.length; i++) {
            var particle = particleSystemStations.geometry.vertices[i];
            p = new THREE.Vector3( (cleanTrafico[i].geo.x-maxGeoX/2) *2, (cleanTrafico[i].geo.y-maxGeoY/2) *2 , 0);
            particle.steer(p, true, 1, 4)
            particle.update();
            line.geometry.vertices[i].set(particle.x, particle.y, particle.z )
       }
        pCount = 0;
       for (var i = 0; i < cleanTrafico.length; i++) {
           var intensidad = cleanTrafico[i].rtdata.intensidad/100;
           //if(intensidad==0) intensidad=1;
           for (var j = 0; j < intensidad; j+=1) {
               var particle = particleSystemIntensity.geometry.vertices[pCount];
               var p;
               if(status==0)
                    p = new THREE.Vector3( (cleanTrafico[i].geo.x-maxGeoX/2) *2, (cleanTrafico[i].geo.y-maxGeoY/2) *2 , 0);
               else
                    p = new THREE.Vector3( (cleanTrafico[i].geo.x-maxGeoX/2) *2, (cleanTrafico[i].geo.y-maxGeoY/2) *2 , -j*4);
               particle.steer(p, true, 1, 4)
               particle.update();
               pCount++;
               if(pCount>=particleCountIntensity ) break;
           }
           if(pCount>=particleCountIntensity ) break;
       }
       line.geometry.verticesNeedUpdate=true


      particleSystemIntensity.geometry.verticesNeedUpdate=true
      particleSystemStations.geometry.verticesNeedUpdate=true

      camera.position.lerpVectors(targetPositions[0], targetPositions[1], globalScrolled)
      camera.lookAt(0,0,0)
      //controls.update();
      // draw
      renderer.render(scene, camera);

      // set up the next call
      requestAnimationFrame(animate);

        //console.log("cc")
    }
