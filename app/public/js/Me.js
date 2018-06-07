var Me = function( scene )
{
  this.scene = scene;
  this.spriteMaterial = undefined;
  this.symbolMaterial = undefined;

  this.updateGeometry = function( pos, scale )
  {
    var spriteMap = new THREE.TextureLoader().load( "img/gl_bg.png" );
    this.spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: CONTROLS.nodeColor } );
    var sprite = new THREE.Sprite( this.spriteMaterial );
    sprite.position.x = pos.x;
    sprite.position.y = pos.y;
    sprite.position.z = pos.z;
    sprite.scale.set( scale.x, scale.y, scale.z );
    this.scene.add( sprite );

    var spriteSymbolMap = new THREE.TextureLoader().load( "img/Friend_Symbols_6.png" );
    this.symbolMaterial = new THREE.SpriteMaterial( { map: spriteSymbolMap, transparent: true, color: CONTROLS.nodeColor } );
    var spriteSymbol = new THREE.Sprite( this.symbolMaterial );
    spriteSymbol.position.x = pos.x;
    spriteSymbol.position.y = pos.y;
    spriteSymbol.position.z = pos.z + 0.01;
    this.symbolMaterial.opacity = 0.55;
    spriteSymbol.scale.set( scale.x * 0.6, scale.y * 0.6, scale.z * 0.6 );
    this.scene.add( spriteSymbol );
  }

  this.update = function()
  {
    this.spriteMaterial.color = CONTROLS.nodeColor;
    this.symbolMaterial.color = CONTROLS.nodeColor;
  }
}