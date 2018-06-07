var Node = function( scene )
{
  this.scene = scene;
  
  this.sprite;
  this.nameSprite;
  this.symbolSprite;

  this.spriteMaterial = undefined;
  this.nameMaterial = undefined;
  this.symbolMaterial = undefined;

  this.posOffsetNameX = 0.0;
  this.posOffsetNameY = -0.4;
  this.posOffsetNameZ = 0.0;

  this.posOffsetSymbolZ = 0.01;

  this.nameScale = 1.6;

  this.online = false;

  this.tweenVals = { value: undefined };

  this.updateGeometry = function( pos, imgPath, scale, online, nameImgPath )
  {
    this.online = online;
    var generalOpacity = 0.5;
    var textOpacity = 1.2;
    var ringOpacity = 0.8;
    if (this.online)
    {
      ringOpacity = 5.5;
    }
    // BG
    var spriteMap = new THREE.TextureLoader().load( "img/gl_bg.png" );
    this.spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, transparent: true, opacity : ringOpacity, color: this.online ? CONTROLS.nodeColor : CONTROLS.nodeColorOff } );
    //this.spriteMaterial.side = THREE.DoubleSide;
    var sprite = new THREE.Sprite( this.spriteMaterial );
    sprite.position.x = pos.x;
    sprite.position.y = pos.y;
    sprite.position.z = pos.z;
    sprite.scale.set( scale.x, scale.y, scale.z );
    this.sprite = sprite;
    this.sprite.lookAt(camera.position);
    this.scene.add( this.sprite );

    // MG
    var spriteMapSymbol = new THREE.TextureLoader().load( imgPath );
    this.symbolMaterial = new THREE.SpriteMaterial( { map: spriteMapSymbol, transparent: true, opacity : generalOpacity, color: CONTROLS.nodeColor } );
    //this.spriteMaterial.side = THREE.DoubleSide;
    var spriteSymbol = new THREE.Sprite( this.symbolMaterial );
    spriteSymbol.position.x = pos.x;
    spriteSymbol.position.y = pos.y;
    spriteSymbol.position.z = pos.z + this.posOffsetSymbolZ;
    var symbolScale = 0.6;
    spriteSymbol.scale.set( scale.x * symbolScale, scale.y * symbolScale, scale.z * symbolScale );
    this.symbolSprite = spriteSymbol;
    this.symbolSprite.lookAt(camera.position);
    this.scene.add( this.symbolSprite );

    // FG
    var spriteMapName = new THREE.TextureLoader().load( nameImgPath );
    this.nameMaterial = new THREE.SpriteMaterial( { map: spriteMapName, transparent: true, opacity : textOpacity, color: CONTROLS.nodeColor } );
    var spriteName = new THREE.Sprite( this.nameMaterial );
    spriteName.position.x = pos.x + this.posOffsetNameX;
    spriteName.position.y = pos.y + this.posOffsetNameY;
    spriteName.position.z = pos.z + this.posOffsetNameZ;
    spriteName.scale.set( scale.x * this.nameScale, scale.y * this.nameScale, scale.z * this.nameScale );
    this.nameSprite = spriteName;
    this.nameSprite.lookAt(camera.position);
    this.scene.add( this.nameSprite );

    if (this.online)
    {
      var tweenVals = { value: ringOpacity  };
      var spriteMaterial = this.spriteMaterial;
      var tween = new TWEEN.Tween(tweenVals) // Create a new tween that modifies 'coords'.
      .to({ value : ringOpacity * 0.3 }, Math.random() * 150 + 50) // Move to (300, 200) in 1 second.
      .easing(TWEEN.Easing.Quadratic.InOut) // Use an easing function to make the animation smooth.
      .onUpdate(function() { // Called after tween.js updates 'coords'.
          // Move 'box' to the position described by 'coords' with a CSS translation.
          spriteMaterial.opacity = tweenVals.value;
      })
      .yoyo( true )
      .repeat( Infinity )
      .start(); // Start the tween immediately.
    }
    
    //this.nameStr = name;
    //this.createNodeText(name);
  }
  
  /*
  this.createTextCanvas = function(text, color, font, size) {
    size = size;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var fontStr = (font || 'Arial') + ' ' + (size +'px');
    ctx.font = fontStr; 
    var w = ctx.measureText(text).width;
    var h = Math.ceil(size*1.25);
    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, size);
    return canvas;
  }

  this.createText2D = function(text, color, font, size, segW, segH) 
  {
    var canvas = this.createTextCanvas(text, color, font, size);
    var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var planeMat = new THREE.MeshBasicMaterial({
      map: tex, color: 0xffffff, transparent: true
    });
    var mesh = new THREE.Mesh(plane, planeMat);
    mesh.doubleSided = true;
    return mesh;
  }

  this.createRing = function(radius)
  {
    var geometry = new THREE.CylinderGeometry( radius, radius, 0.02, 64 );
    var edges = new THREE.EdgesGeometry( geometry );
    this.ring = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x059eeb } ) );
    this.ring.position.x = this.position.x;
    this.ring.position.y = this.position.y;
    this.ring.position.z = this.position.z;
    this.scene.add( this.ring );
  }

  this.createNodeText = function(name) {

    var mesh = this.createText2D(name, "yellow", "Arial", 32, 4, 4);
    //mesh.overdraw = true;
    //mesh.doubleSided = true;
    mesh.position.x = this.position.x + 0.22;
    mesh.position.y = this.position.y;
    mesh.position.z = this.position.z + 0.1;
    mesh.scale.x = 0.01;
    mesh.scale.y = 0.01;

    sceneText.add(mesh);
  }
  */

  this.update = function(pos)
  {
    this.sprite.position.x = pos.x;
    this.sprite.position.y = pos.y;
    this.sprite.position.z = pos.z;

    this.nameSprite.position.x = pos.x + this.posOffsetNameX;
    this.nameSprite.position.y = pos.y + this.posOffsetNameY;
    this.nameSprite.position.z = pos.z + this.posOffsetNameZ;

    this.symbolSprite.position.x = pos.x;
    this.symbolSprite.position.y = pos.y;
    this.symbolSprite.position.z = pos.z + this.posOffsetSymbolZ;

    this.spriteMaterial.color = this.online ? CONTROLS.nodeColor : CONTROLS.nodeColorOff;
    
    this.nameMaterial.color = this.online ? CONTROLS.nodeColor : CONTROLS.nodeColorOff;

    this.symbolMaterial.color = this.online ? CONTROLS.nodeColor : CONTROLS.nodeColorOff;
  }
}