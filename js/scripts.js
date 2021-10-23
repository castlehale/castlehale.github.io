
var images2 = [];

function hideStuff() {
    //    $(searches).hide();
}

function goHome() {
    location.reload();
}

function getPage() {

    var container;
    var camera, scene, renderer;
    var parameters = {
        width: 2000,
        height: 2000,
        widthSegments: 250,
        heightSegments: 250,
        depth: 1500,
        param: 4,
        filterparam: 1
    };
    var waterNormals;
    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        scene = new THREE.Scene();
        var cubeMap = new THREE.CubeTexture([]);
        cubeMap.format = THREE.RGBFormat;
        var loader = new THREE.ImageLoader();
        loader.load("./3.png", function (image) {
            var getSide = function (x, y) {
                var size = 1024;
                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                var context = canvas.getContext('2d');
                context.drawImage(image, -x * size, -y * size);

                return canvas;
            };
            cubeMap.images[0] = getSide(2, 1); // px
            cubeMap.images[1] = getSide(0, 1); // nx
            cubeMap.images[2] = getSide(1, 0); // py
            cubeMap.images[3] = getSide(1, 2); // ny
            cubeMap.images[4] = getSide(1, 1); // pz
            cubeMap.images[5] = getSide(3, 1); // nz
            cubeMap.needsUpdate = true;
        });
       var cubeShader = THREE.ShaderLib['cube'];
       cubeShader.uniforms['tCube'].value = cubeMap;
        var skyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        var skyBox = new THREE.Mesh(
            new THREE.BoxGeometry(1000000, 1000000, 1000000),
            skyBoxMaterial
        );
        scene.add(skyBox);
        var geometry = new THREE.IcosahedronGeometry(400, 4);
        for (var i = 0, j = geometry.faces.length; i < j; i++) {
            geometry.faces[i].color.setHex(Math.random() * 0xffffff);
        }
        var material = new THREE.MeshPhongMaterial({
            vertexColors: THREE.FaceColors,
            shininess: 100,
            envMap: cubeMap
        });
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 3000000);
        camera.position.set(2000, 750, 2000);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        //if exists then controls = new THREE.DeviceOrientationControls(camera, renderer.domElement);
        //if exists then controls = new THREE.VRControls(camera, renderer.domElement);

        controls.enablePan = false;
        controls.minDistance = 1000.0;
        controls.maxDistance = 5000.0;
        controls.maxPolarAngle = Math.PI * 0.495;
        controls.target.set(0, 500, 0);
        scene.add(new THREE.AmbientLight(0x444444));
        var light = new THREE.DirectionalLight(0xffffbb, 1);
        light.position.set(-1, 1, -1);
        scene.add(light);
        waterNormals = new THREE.TextureLoader().load('../waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        water = new THREE.Water(renderer, camera, scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffff55,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
        });
        mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
            water.material
        );
        mirrorMesh.add(water);
        mirrorMesh.rotation.x = -Math.PI * 0.5;
        scene.add(mirrorMesh);

    }

    function resizeCanvas() {
        $(document).width = window.innerWidth;
        $(document).height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();

    }
    function render() {
        var time = performance.now() * 0.001;
        water.material.uniforms.time.value += 1.0 / 60.0;
        controls.update();
        water.render();
        renderer.render(scene, camera);

    }



}


function toggleVisibility(element) {
    
    if (element.id == 'banner1') {
        var visibility1 = document.getElementById('banner2');
        visibility1.style.display = 'none';
    }
    if (element.id == 'banner2') {
        var visibility1 = document.getElementById('banner1');
        visibility1.style.display = 'none';
    }
    if (element.style.display == 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
};
function mouseHandler() {
    // set mouse control for 'headtracking' >> removed from current codebase
    var card = $(".card");
    $(document).on("mousemove", function (e) {
        var ax = -($(window).innerWidth() / 2 - e.pageX) / 20;
        var ay = ($(window).innerHeight() / 2 - e.pageY) / 10;
        card.attr("style", "transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg);-webkit-transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg);-moz-transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg)");
    });
}
function touchHandler(e) {
    // set touch control for 'headtracking' >> removed from current codebase
    var ax = -($(window).innerWidth() / 2 - e.pageX) / 20;
    var ay = ($(window).innerHeight() / 2 - e.pageY) / 10;
    card.attr("style", "transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg);-webkit-transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg);-moz-transform: rotateY(" + ax + "deg) rotateX(" + ay + "deg)");
};
var folder = "./thumbs/";
images2.push('<ul>');
        $.ajax({
            url: folder,
            success: function(data) {
    
                $(data).find("a").attr("href", function(i, val) {
                    if (val.match(/\.(jpe?g|png|webp)$/)) {
                        //images2.push("<li><img src='"+folder+val+"'></li>");
                        images2.push('<li><a href=./images/"' + val + '" class="fresco" data-fresco-group="shared_options" class="fresco" data-fresco-group="shared_options"> <img src="./images/' + val + '"height="100" width="100" /> </a></li>');
    
                    }
                });images2.push('</ul>')
                //alert(images2.join(""))
                var images3 = images2.join('');
                console.log(images3);
                $(showtags).html(images3);
            }
    
        });
$(document).ready(function () {
    $('.loading').fadeOut(500);
    $('#curtain2').fadeOut(500);
    $('#curtain3').fadeOut(2500);
    $('#curtain3').fadeIn(2500);
    $('#curtain3').fadeOut(2500);



    //$(window).hashchange();
    //mouseHandler();
    //window.addEventListener("touchstart", touchHandler, false);

    getPage();

});


function showMedia() {


    $('#curtain1').fadeIn(1500);
    var canvas = document.getElementById('bigCanvas');


    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas, false);
    

    
    function DblHelix(n, rx, ry, rz) {
        var a = Math.PI / n,
            i, j, p = [],
            z = rz * 2 / n;
        for (i = 0; i < n; ++i) {
            j = a * i;
            if (i % 2)
                j += Math.PI;
            p.push([rx * Math.cos(j),
                rz - z * i,
                ry * Math.sin(j)
            ]);
        }
        return p;
    };
    var tagOpt;

        mouseOpt = { dragControl: false, shape: "vcyl", lock: 'y', outlineColour: '#0F0', clickToFront: 500, reverse: true, depth: 2.0, maxSpeed: 0.03, initial: [0.02, 0.02], zoom: 0.95, imageRadius: 200, imageMode: "image", outlineMethod: 'outline', outlineOffset: 10, pulsateTime: 0.5, pulsateTo: 0.1, outlineDash: 150, outlineThickness: 25, outlineRadius: 200, fadeIn: 3000, decel: .5, pinchZoom: true, imageVAlign: "top", shuffleTags: true }
        tagOpt = mouseOpt;
        console.log("mouseopt Loaded");
    
    
   
    
    function getSearch() {
    

        tagRender(tagOpt);
    
    };

    
    function tagRender(o) {
        var s = (new Date).getTime() / 360;
    
        function rst() { TagCanvas.Start('bigCanvas', 'showtags', tagOpt); }
    
        function ttf() { TagCanvas.TagToFront('bigCanvas', { index: Math.floor(Math.random() * 10), time: 800 }); }
    
        function rt() { TagCanvas.RotateTag('bigCanvas', { index: Math.floor(Math.random() * 10), lat: -30, lng: 90, time: 800 }); }
        s.src = './js/jquery.tagcanvas.min.js';
        s.onload = rst;
    
        TagCanvas.Start('bigCanvas', 'showtags', tagOpt);
    }
    
    function tcPause() { TagCanvas.Pause('bigCanvas'); }
    
    function tcResume() { TagCanvas.Resume('bigCanvas'); }
    
    function tcReload() { TagCanvas.Reload('bigCanvas', 'showtags'); }
    
    function tcUpdate() { TagCanvas.Update('bigCanvas'); }
    
    function tcFront() { TagCanvas.TagToFront('bigCanvas', { index: Math.floor(Math.random() * 20), active: 1 }); }
    
    function tcRotate() {
        TagCanvas.RotateTag('bigCanvas', {
            index: Math.floor(Math.random() * 20),
            lat: -60,
            lng: -60,
            time: 800,
            active: 1
        });
    }
    
    function tcSpeed() {
        var a = Math.random() * Math.PI * 2,
            b = 0.1 + Math.random() * 0.9;
        TagCanvas.SetSpeed('bigCanvas', [b * Math.sin(a), b * Math.cos(a)]);
    }
    
    
    
    
    resizeCanvas();
    getSearch() 
}