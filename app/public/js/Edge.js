var Edge = function( scene, lineCount, together ) 
{
  this.scene = scene;
  this.line_geometries = [];
  this.line_meshes = [];
  this.shaderMaterial = undefined;
  this.lineCount = lineCount;
  this.together = together;

  this.getLinePositions = function(startPos, endPos, a, lineCount = 1)
  {
    //var length_point = getLength(startPos, endPos);
    var center_point = getCenterPoints(startPos, endPos);

    var lineRoundness = a * 0.002 * lineCount;
    startPos.y += lineRoundness;
    endPos.y += lineRoundness;
    center_point.y += lineRoundness;
    //center_point.z += a * 0.1; //length_point * 0.8;

    // get points for the curve
    var curve = new THREE.QuadraticBezierCurve3(startPos, center_point, endPos);
    var pointDensity = 10;//Math.ceil(length_point * 3.0);
    var points = curve.getPoints(pointDensity);
    var positions = new Float32Array( points.length * 3 );
    
    for (var i = 0; i < points.length; i++)
    {
      positions[i * 3]     = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }

    return positions;
  }

  this.updateGeometry = function(startPos, endPos)
  {      
    // color
    //var color = CONTROLS.lineColor;
    //var HSL = color.getHSL( color );
    //color.setHSL(HSL.h, 1.2, 1.0);
    var uniforms = {
      color: { type: "c", value: CONTROLS.lineColor}
    };      
    this.shaderMaterial = new THREE.ShaderMaterial( {
      //attributes:     line_geometry.custom_attributes,
      uniforms:       uniforms,
      vertexShader:   document.getElementById( 'line_vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'line_fragmentshader' ).textContent,
      blending:       THREE.AdditiveBlending,
      depthTest:      false,
      transparent:    true

    } );
    this.shaderMaterial.linewidth = 1;

    // center position for curve
    for ( m = 0; m < this.lineCount; m++)
    {
      // create buffer geo
      var line_geometry = new THREE.BufferGeometry();//new THREE.Geometry();

      // position
      var positions = this.getLinePositions(startPos, endPos, 1.0, m);
      line_geometry.addAttribute( 'position' , new THREE.BufferAttribute( positions, 3 ) );
      
      // alpha - vertex
      var pointsCount  = positions.length / 3;
      var vertexAlphas = new Float32Array( pointsCount );
      for (var i=0; i < pointsCount; i++){
        vertexAlphas[i] = 1.0;
      }
      line_geometry.addAttribute('vtx_alpha', new THREE.BufferAttribute( vertexAlphas , 1 ) );
      line_geometry.getAttribute('vtx_alpha').needsUpdate = true;
      
      //Create the final Object3d to add to the scene
      var line_mesh = new THREE.Line( line_geometry, this.shaderMaterial );
      this.line_geometries.push(line_geometry);;
      this.line_meshes.push(line_mesh);

      // finally add to the SCENE
      this.scene.add(line_mesh);
    }          
  }

  
  this.update = function(startPos, endPos, a) 
  { 
    /*
    var uniforms = {
      color: { type: "c", value: CONTROLS.lineColor}
    };
    this.shaderMaterial = new THREE.ShaderMaterial( {
      //attributes:     line_geometry.custom_attributes,
      uniforms:       uniforms,
      vertexShader:   document.getElementById( 'line_vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'line_fragmentshader' ).textContent,
      blending:       THREE.AdditiveBlending,
      depthTest:      false,
      transparent:    true

    } );
    this.shaderMaterial.linewidth = 1;
    */
    
    this.shaderMaterial = new THREE.LineBasicMaterial( {
      color: CONTROLS.lineColor,
      linewidth: 5,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      transparent: false
    } );

    for (i=0;i<this.line_meshes.length;i++)
    {
      this.line_meshes[i].material = this.shaderMaterial;
    }

    for (i=0;i<this.line_geometries.length;i++)
    {
      var geo = this.line_geometries[i];
      var positions = this.getLinePositions(startPos, endPos, a, i);
      var idx = 0;
      for ( s = 0; s < geo.getAttribute('position').count; s++)
      {
        geo.getAttribute('position').needsUpdate = true;

        geo.getAttribute('position').setX(s, positions[idx]);
        idx += 1;
        geo.getAttribute('position').setY(s, positions[idx]);
        idx += 1;
        geo.getAttribute('position').setZ(s, positions[idx]);
        idx += 1;
      }
    }

  }
    /*
    for ( i = 0; i < this.line_geometry.getAttribute('vtx_alpha').count; i++)
    {
      this.line_geometry.getAttribute('vtx_alpha').needsUpdate = true;
      this.line_geometry.getAttribute('vtx_alpha').setX(i, 1.0);
    }
      
                  if ( i < geo.getAttribute('vtx_alpha').count ) {

        // index will match the vertex count in the geo to grab each vertex's vtx_alpha attribute.
        var index = Math.floor(i);
        geo.getAttribute('vtx_alpha').needsUpdate = true;
        geo.getAttribute('vtx_alpha').setX(index, 0.4);
    */

    //var i = FRAME.value - 24;
    //console.log(this.line_geometries.length);
    /*
    for ( k = 0; k < this.line_geometries.length; k++)
    {
      var geo = this.line_geometries[k];

      for ( i = 0; i < geo.getAttribute('vtx_alpha').count; i++)
      {
        geo.getAttribute('vtx_alpha').needsUpdate = true;
        geo.getAttribute('vtx_alpha').setX(i, 1.0);
      }

      }  
    }
    */
    
    /*
  }*/
};