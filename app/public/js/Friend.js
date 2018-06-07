var Friend = function( scene )
{
  this.scene = scene;
  this.edgeDatas = [];
  this.nodeDatas = [];

  this.usedPositions = [];
  this.q1 = [];
  this.q2 = [];
  this.q3 = [];
  this.q4 = [];
  this.startPoses = [];
  this.endPoses = [];

  this.edges = [];
  this.nodes = [];

  this.generateData = function()
  {
    var maxD = 6.0;
    var minD = 1.0;

    for (i=0;i<5;i++)
    {
      var x = mapRange([0.0, 1.0], [-maxD, -minD], Math.random());
      var y = mapRange([0.0, 1.0], [minD, maxD], Math.random());
      var z = mapRange([0.0, 1.0], [-9, 1], Math.random());
      var pos = new THREE.Vector3(x, y, z);
      this.q1.push(pos);
    }

    for (i=0;i<5;i++)
    {
      var x = mapRange([0.0, 1.0], [minD, maxD], Math.random());
      var y = mapRange([0.0, 1.0], [minD, maxD], Math.random());
      var z = mapRange([0.0, 1.0], [-9, 1], Math.random());
      var pos = new THREE.Vector3(x, y, z);
      this.q2.push(pos);
    }

    for (i=0;i<5;i++)
    {
      var x = mapRange([0.0, 1.0], [minD, maxD], Math.random());
      var y = mapRange([0.0, 1.0], [-maxD, -minD], Math.random());
      var z = mapRange([0.0, 1.0], [-1, 1], Math.random());
      var pos = new THREE.Vector3(x, y, z);
      this.q3.push(pos);
    }

    for (i=0;i<5;i++)
    {
      var x = mapRange([0.0, 1.0], [-maxD, -minD], Math.random());
      var y = mapRange([0.0, 1.0], [-maxD, -minD], Math.random());
      var z = mapRange([0.0, 1.0], [-9, 1], Math.random());
      var pos = new THREE.Vector3(x, y, z);
      this.q4.push(pos);
    }
    
    var allPosLists1 = [this.q1,this.q2,this.q3,this.q4];
    for (i=0; i<allPosLists1.length; i++){
      var ls = allPosLists1[i];
      for (j=0; j<ls.length; j++)
      {
        this.startPoses.push(ls[j]);
      }
    }

    var allPosLists2 = [this.q2,this.q3,this.q4,this.q1];
    for (i=0; i<allPosLists2.length; i++){
      var ls = allPosLists2[i];
      for (j=0; j<ls.length; j++)
      {
        this.endPoses.push(ls[j]);
      }
    }

    // Adding EDGES
    var lineCountMap = [3, 6, 10];
    for (i=0; i< this.startPoses.length ; i++)
    {
      var startPos = this.startPoses[i];
      var startPosFlat = new THREE.Vector3(startPos.x, 0.0, 0.0);
      var endPos = this.endPoses[i];
      var endPosFlat = new THREE.Vector3(endPos.x, 0.0, 0.0);

      var data = { 
        lineCount: lineCountMap[Math.floor(mapRange([0.0, 1.0], [0, 2.9], Math.random()))],
        together:true,
        startPos: startPos,
        endPos: endPos,
        startPosFlat: startPosFlat,
        endPosFlat: endPosFlat
      }

      this.usedPositions.push(startPos);
      //this.usedPositions.push(endPos);

      this.edgeDatas.push(data);
    }

    // Adding Centrified EDGES
    var lineCountMap = [3, 6, 10];
    for (i=0; i< this.usedPositions.length ; i++)
    {
      var startPos = this.usedPositions[i];
      var startPosFlat = new THREE.Vector3(startPos.x, 0.0, 0.0);
      var endPos = new THREE.Vector3(0.0, 0.0, 0.0);
      var endPosFlat = new THREE.Vector3(0.0, 0.0, 0.0);

      var data = { 
        lineCount: lineCountMap[Math.floor(mapRange([0.0, 1.0], [0, 2.9], Math.random()))],
        together:true,
        startPos: startPos,
        endPos: endPos,
        startPosFlat: startPosFlat,
        endPosFlat: endPosFlat
      }

      this.edgeDatas.push(data);
    }

    // Adding NODES
    for (i=0; i<this.usedPositions.length; i++)
    {
      var scale = mapRange([0.0, 1.0], [0.7, 0.8], Math.random());
      var pos = this.usedPositions[i];
      var posFlat = new THREE.Vector3(pos.x, 0.0, 0.0);
      var data = { 
        online: Math.random() > 0.7 ? true:false,
        pos: pos,
        posFlat: posFlat,
        scale: new THREE.Vector3(scale, scale, 1.0)
      }  
      this.nodeDatas.push(data);
    }
  }

  this.createGeometry = function()
  {
    // edge
    for ( d = 0; d < this.edgeDatas.length; d++)
    {
      var edge = new Edge( scene, this.edgeDatas[d].lineCount, this.edgeDatas[d].together );
      edge.updateGeometry( 
        this.edgeDatas[d].startPos,
        this.edgeDatas[d].endPos );
        this.edges.push(edge);
    }

    // node
    for ( b = 0; b < this.nodeDatas.length; b++)
    {
      var node = new Node( scene );

      // symbol setup
      var symbolID = Math.floor(Math.random() * 15) + 1;
      var symbolImgPath = "img/Friend_Symbols_" + symbolID + ".png";

      // name setup
      var nameID = Math.floor(mapRange([0.0, 1.0], [0, 6], Math.random())) + 1;
      var nameImgPath = "img/name" + nameID + ".png";;

      node.updateGeometry( 
        this.nodeDatas[b].pos,
        symbolImgPath, 
        this.nodeDatas[b].scale, 
        this.nodeDatas[b].online, 
        nameImgPath
      );

      this.nodes.push(node);
    }
  }
}