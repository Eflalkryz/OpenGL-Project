var canvas;
var gl;
var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];
var pos = [0, 0, 0, 0];
var scale = [0, 0, 0, 0];

var thetaLoc;
var poslog;
var scaleLog;

//TODO: Define any global variables if needed

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        vec4(0.0000, 0.0000, -1.0000),
        vec4(0.0000, 0.9428, 0.3333),
        vec4(-0.8165, -0.4714, 0.3333),
        vec4(0.8165, -0.4714, 0.3333)
    ];
    tetra(vertices[0], vertices[1], vertices[2], vertices[3]);

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    

    gl.enable(gl.DEPTH_TEST);
    

    //  Load shaders and initialize attribute buffers    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );    
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    poslog = gl.getUniformLocation(program, "pos");
    scaleLog = gl.getUniformLocation(program, "scale");

    // sliders for viewing parameters
	document.getElementById("rotX").oninput = function(event) {
        axis=xAxis;
        theta[axis] =parseFloat(event.target.value);
        gl.uniform3fv(thetaLoc, theta);
    };
	
    document.getElementById("rotY").oninput = function(event) {
        axis=yAxis;
        theta[axis] =parseFloat(event.target.value);
        gl.uniform3fv(thetaLoc, theta);
    };

    document.getElementById("objRotationZSlider").oninput = function(event) {
        axis=zAxis;
        theta[axis] =parseFloat(event.target.value);
        gl.uniform3fv(thetaLoc, theta);
    };
   
    document.getElementById("posX").oninput = function(event) {
        axis=xAxis;
        pos[axis] = parseFloat(event.target.value);
        gl.uniform4fv(poslog, pos);
        render();
    };
	
    document.getElementById("posY").oninput = function(event) {
        axis=yAxis;
        pos[axis]= parseFloat(event.target.value);
        gl.uniform4fv(poslog, pos);
        render();
    };
	
	document.getElementById("scaleX").oninput = function(event) {
        scale[0] = parseFloat(event.target.value);
        gl.uniform4fv(scaleLog, scale);
        render();
    };
	
    document.getElementById("scaleY").oninput = function(event) {
        scale[1] = parseFloat(event.target.value);
        gl.uniform4fv(scaleLog, scale);
        render();
    };
	   
	document.getElementById("ResetButton").addEventListener("click", function(){
		theta = [0, 0, 0];
        var pos = [0, 0, 0, 0];
        var scale = [0, 0, 0, 0];
        document.getElementById("rotX").value = 0;
        document.getElementById("rotY").value = 0;
        document.getElementById("objRotationZSlider").value = 0;
        document.getElementById("posX").value = 0;
        document.getElementById("posY").value = 0;
        document.getElementById("scaleX").value = 0;
        document.getElementById("scaleY").value = 0;
        gl.uniform3fv(thetaLoc, theta);
        gl.uniform4fv(scaleLog, scale);
        gl.uniform4fv(poslog, pos);

        render();
    });	
    
   
    render();
}

function triangle(a, b, c, color) {
    points.push(a, b, c);
    colors.push(color, color, color);
}

function tetra(a, b, c, d) {
    triangle(a, b, d, vec4(1.0, 0.0, 0.0, 1.0)); // Kırmızı
    triangle(b, c, d, vec4(0.0, 1.0, 0.0, 1.0)); // Yeşil
    triangle(a, b, c, vec4(0.0, 0.0, 1.0, 1.0)); // Mavi
    triangle(a, c, d, vec4(1.0, 1.0, 0.0, 1.0)); // Sarı
}

//TODO:modify this function to render the shape 
// and apply transformations in the correct order
var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    requestAnimFrame(render);
}
