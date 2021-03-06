var camera, scene, renderer, glowComposer, controls, rendererText;

      var sceneText;

      var mouseX = 0, mouseY = 0, windowHalfX = 0, windowHalfY = 0;

      var bloomPass, renderPass;

      var gui;

      var clock = new THREE.Clock();

      var FRAME = { value: 0 };

      var params = {
        layout: 1.0,
        strength: 3.3,
        radius: 1,
        threshold: 0.4,
        color_line: 0xc0721c, 
        color_node: 0xffce59,
        color_node_off: 0x42828c,
      };


      var CONTROLS = { layout: 1.0, 
        lineColor: new THREE.Color(params.color_line), 
        nodeColor: new THREE.Color(params.color_node), 
        nodeColorOff: new THREE.Color(params.color_node_off)
      };

      var stars = [];
      var parameters = [];
      var materials = [];

      var friends = [];

      var me;

      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // Camera Setup
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 5;

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
     
        scene = new THREE.Scene();
        fogHex = 0x000000; /* As black as your heart. */
        fogDensity = 0.002; /* So not terribly dense?  */

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        sceneText = new THREE.Scene();

        me = new Me(scene);
        me.updateGeometry( new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.0, 1.0, 1.0));
        
        var friend = new Friend(scene);
        friend.generateData();
        friend.createGeometry();
        friends.push(friend);

        // starfield
        initStars(scene);

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias : true });
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        renderPass = new THREE.RenderPass( scene, camera );
        renderPass.clear = true;
        renderPass.clearDepth = true;

        var renderPassText = new THREE.RenderPass( sceneText, camera );
        renderPassText.clear = false;
        renderPassText.clearDepth = true;

        var bloomPass2 = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), params.strength, params.radius, params.threshold);
        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;

        composerGlow = new THREE.EffectComposer(renderer);
        
        composerGlow.addPass( renderPass );
        composerGlow.addPass( bloomPass2 );
        composerGlow.addPass( renderPassText );
        composerGlow.addPass( copyShader );

        // GUI
        gui = new dat.GUI();
        gui.add( params, 'layout', 0.0, 1.0 ).onChange( function (value ) {
          CONTROLS.layout = value;
        })
        gui.add( params, 'strength', 0.0, 10.0 ).onChange( function ( value ) {
          bloomPass2.strength = Number( value );
        } );
        gui.add( params, 'radius', 0.0, 1.3 ).onChange( function ( value ) {
          bloomPass2.radius = Number( value );
        } );
        gui.add( params, 'threshold', 0.0, 2.0 ).onChange( function ( value ) {
          bloomPass2.threshold = Number( value );
        } );
        gui.addColor(params, 'color_line').onChange( function ( value ) {
          CONTROLS.lineColor = new THREE.Color(value);
        });
        gui.addColor(params, 'color_node').onChange( function ( value ) {
          CONTROLS.nodeColor = new THREE.Color(value);
        });
        gui.addColor(params, 'color_node_off').onChange( function ( value) {
          CONTROLS.nodeColorOff = new THREE.Color(value);
        })
        gui.close();

        controls = new THREE.FlyControls( camera );
				controls.movementSpeed = 1000;
				controls.domElement = renderer.domElement;
				controls.rollSpeed = Math.PI / 36;
				controls.autoForward = false;
				controls.dragToLook = false;

        /* Event Listeners */
        window.addEventListener('resize', onWindowResize, false);
      }
       
      function animate(time) {

        TWEEN.update(time);
       
        composerGlow.render();

        FRAME.value += 1;
        requestAnimationFrame( animate );

        var a = CONTROLS.layout;

        var delta = clock.getDelta();
        controls.movementSpeed = 0.1 * d;
				controls.update( delta );

        me.update();

        for (i=0;i<friends.length;i++)
        {
          var f = friends[i];

          for (j=0;j<f.edges.length;j++)
          {
            var newEdgeStartPosX = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].startPosFlat.x, f.edgeDatas[j].startPos.x], a);
            var newEdgeStartPosY = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].startPosFlat.y, f.edgeDatas[j].startPos.y], a);
            var newEdgeStartPosZ = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].startPosFlat.z, f.edgeDatas[j].startPos.z], a);

            var newEdgeEndPosX = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].endPosFlat.x, f.edgeDatas[j].endPos.x], a); 
            var newEdgeEndPosY = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].endPosFlat.y, f.edgeDatas[j].endPos.y], a); 
            var newEdgeEndPosZ = mapRange([0.0, 1.0], 
              [f.edgeDatas[j].endPosFlat.z, f.edgeDatas[j].endPos.z], a); 

            f.edges[j].update(new THREE.Vector3(newEdgeStartPosX, newEdgeStartPosY, newEdgeStartPosZ), 
              new THREE.Vector3(newEdgeEndPosX, newEdgeEndPosY, newEdgeEndPosZ), a);
          }

          for (j=0;j<f.nodes.length;j++)
          {
            var newNodePosX = mapRange([0.0, 1.0], 
              [f.nodeDatas[j].posFlat.x, f.nodeDatas[j].pos.x], a);
            var newNodePosY = mapRange([0.0, 1.0], 
              [f.nodeDatas[j].posFlat.y, f.nodeDatas[j].pos.y], a);
            var newNodePosZ = mapRange([0.0, 1.0], 
              [f.nodeDatas[j].posFlat.z, f.nodeDatas[j].pos.z], a);
            f.nodes[j].update(new THREE.Vector3(newNodePosX, newNodePosY, newNodePosZ));
          }
        }

        animateStars();
      }

      function animateStars()
      {
        var time = Date.now() * 0.000005;
        for (i = 0; i < stars.length; i++) {

            var object = stars[i];

            object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
      }

      function initStars(scene)
      {
        var geometry = new THREE.Geometry(); 

        var particleCount = 4000; 

        for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 250 - 125;
            vertex.y = Math.random() * 250 - 125;
            vertex.z = Math.random() * 250 - 125 + 40;
            geometry.vertices.push(vertex);
        }

        parameters = [
            [
                0xFFA500, 0.03
            ],
            [
                0x87ceeb, 0.1
            ],
            [
                0xFFA500, 0.05
            ],
            [
                0x87ceeb, 0.02
            ],
            [
                0xFFA500, 0.06
            ]
        ];
        var parameterCount = parameters.length;

        for (i = 0; i < parameterCount; i++) {

            var color = parameters[i][0];
            var size = parameters[i][1];

            materials[i] = new THREE.PointsMaterial({
                color: color,
                size: size
            });

            particles = new THREE.PointCloud(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            stars.push(particles);
            scene.add(particles);
        }
      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
        composer.setSize( window.innerWidth, window.innerHeight );
      }

      init();
      animate();