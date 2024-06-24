"use strict";

var shadedCube = function() {

var canvas;
var gl;

var fov = 45;
var aspect = 1;
var near = 0.01;
var far = 100.0;

var eye = vec3(2.0,2.0,2.0); // 카메라 위치
var at = vec3(0.0,0.0,0.0);
var up = vec3(0.0,1.0,0.0);


var numPositions = 66;

var positionsArray = [];
var normalsArray = [];

var vertices = [
        vec4(-0.5, -0.25,  1.0, 1.0),
        vec4(-0.5,  0.0,  1.0, 1.0),
        vec4(0.5,  0.0,  1.0, 1.0),
        vec4(0.5, -0.25,  1.0, 1.0),
        vec4(-0.5, -0.25, -0.5, 1.0),
        vec4(-0.5,  0.0, -0.5, 1.0),
        vec4(0.5,  0.0, -0.5, 1.0),
        vec4(0.5, -0.25, -0.5, 1.0),
        vec4(-0.5,0.0,-0.25,1.0),
        vec4(-0.5,0.25,-0.25,1.0),
        vec4(0.5,0.25,-0.25,1.0),
        vec4(0.5,0.0,-0.25,1.0),
        vec4(-0.5,0.25,-0.5,1.0),
        vec4(0.5,0.25,-0.5,1.0)
    ];

var lightPosition = vec4(2.0, 2.0, 2.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;
var theta = vec3(0, 0, 0);
var direction = 1; 

var thetaLoc;

var flag = false;

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);


     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[d]);
     normalsArray.push(normal);
}


function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(9,8,11,10);
    quad(10,11,6,13);
    quad(13,6,5,12);
    quad(12,5,8,9);
    quad(9,10,13,12);
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "theta");


    projectionMatrix = perspective(fov,aspect,near,far);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis; direction = -direction;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis; direction = -direction;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis; direction = -direction;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag; direction = -direction;};

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"), materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
       false, flatten(projectionMatrix));

   cubeVerticesTextureCoordBuffer = gl.createBuffer();
    render();
}

var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0 * direction;

    //modelViewMatrix = mat4();
    modelViewMatrix = lookAt(eye,at,up);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    //console.log(modelView);

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uModelViewMatrix"), false, flatten(modelViewMatrix));

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);


    requestAnimationFrame(render);
}

}

shadedCube();
