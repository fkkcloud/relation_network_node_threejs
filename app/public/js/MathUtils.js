function mapRange(from, to, s) 
{
	
	return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);

};
    
function getCenterPoints(pt1, pt2)
{

	var x = (pt1.x + pt2.x) * 0.5;
	var y = (pt1.y + pt2.y) * 0.5;

	return new THREE.Vector3(x, y, 0.0);

}

function getLength(pt1, pt2)
{

	return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));

}

function rgbToHex(r, g, b)
{

	r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

	return "#" +
  		("0" + parseInt(r,10).toString(16)).slice(-2) +
  		("0" + parseInt(g,10).toString(16)).slice(-2) +
  		("0" + parseInt(b,10).toString(16)).slice(-2);

}

function hexToRGB(hex)
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}