"use strict";

var shadedCube = function() {

var canvas;
var gl;

var fov = 45;
var aspect = 1;
var near = 0.01;
var far = 100.0;

var eye = vec3(2.0,2.0,2.0); 
var at = vec3(0.0,0.0,0.0);
var up = vec3(0.0,1.0,0.0);


var numPositions = 84;

var positionsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var textures = [];

var images = [
    'http://localhost/02/tree1.bmp',
    'http://localhost/02/bed.bmp',
    'http://localhost/02/bedwood.bmp'
];

var texCoord = [
    [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)],
    [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)],
    [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)]
];

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
        vec4(0.5,0.25,-0.5,1.0),

        vec4(-1.5, -0.015,  0.0, 1.0),
        vec4(-1.5,  0.015,  0.0, 1.0),
        vec4(1.5,  0.015,  0.0, 1.0),
        vec4(1.5, -0.015,  0.0, 1.0),

        vec4(0.0, 0.015,  -1.5, 1.0),
        vec4(0.0,  -0.015,  -1.5, 1.0),
        vec4(0.0,  -0.015,  1.5, 1.0),
        vec4(0.0, 0.015,  1.5, 1.0),

        vec4(-0.015, 1.5,  0.0, 1.0),
        vec4(-0.015,  -1.5,  0.0, 1.0),
        vec4(0.015,  -1.5, 0.0, 1.0),
        vec4(0.015, 1.5,  0.0, 1.0),
    ];

var lightPosition = vec4(4.0, 4.0, 4.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.5, 0.5, 0.5, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 1.0, 1.0);
var materialSpecular = vec4(.5, 0.8, 0.5, 1.0);
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

function configureTexture( image ,index) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    textures[index] = texture;
}


var flag = false;

function quad(a, b, c, d, textureIndex) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][0]);

     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][1]);

     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][2]);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][0]);

     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][2]);

     positionsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[textureIndex][3]);
}


function colorCube()
{
    quad(0, 1, 2, 3, 0);
    quad(7, 6, 2, 3, 0);
    quad(3, 0, 4, 7, 0);
    quad(5, 4, 7, 6, 0);
    quad(5, 4, 0, 1, 0);
    quad(10,11,6,13, 0);
    quad(12,5,6,13, 0);
    quad(12,5,8,9, 0);
    quad(2,6,5,1, 0);
    quad(8,9,10,11, 0);
    quad(9,10,13,12, 0);
    quad(17,14,15,16,0);
    quad(18,19,20,21,0);
    quad(22,23,24,25,0);
}

function drawaxis()
{ 
   quad(20,21,18,19,0);
   quad(24,23,22,25,0);
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

       var tBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
   
       var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
       gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(texCoordLoc);
       
       loadImages(images, function(loadedImages) {
        for (var i = 0; i < loadedImages.length; i++) {
            configureTexture(loadedImages[i], i);
        }
        render();
    });

     render();
}

function loadImages(urls, callback) {
    var images = [];
    var loadedImages = 0;
    for (var i = 0; i < urls.length; i++) {
        images[i] = new Image();
        images[i].crossOrigin = "anonymous";
        images[i].onload = function() {
            if (++loadedImages >= urls.length) {
                callback(images);
            }
        };
        images[i].src = urls[i];
    }
}

var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 1.0 * direction;

    //modelViewMatrix = mat4();
    modelViewMatrix = lookAt(eye,at,up);
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    //console.log(modelView);
    //gl.uniform1i(gl.getUniformLocation(program, "uObjectAxis"), 1);
    gl.uniform1i(gl.getUniformLocation(program, "uReceivesLight"), 1);
    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uModelViewMatrix"), false, flatten(modelViewMatrix));

    

     gl.bindTexture(gl.TEXTURE_2D, textures[0]);
     gl.drawArrays(gl.TRIANGLES, 0, 48);

     gl.bindTexture(gl.TEXTURE_2D, textures[1]);
     gl.drawArrays(gl.TRIANGLES, 48, 6);

     gl.bindTexture(gl.TEXTURE_2D, textures[2]);
     gl.drawArrays(gl.TRIANGLES, 54, 12);

     gl.uniformMatrix4fv(gl.getUniformLocation(program,
        "uModelViewMatrix"), false, flatten(lookAt(eye,at,up)));
    
     gl.uniform1i(gl.getUniformLocation(program, "uReceivesLight"), 0);
     var red = vec4(1.0,0.0,0.0,1.0);
     var green = vec4(0.0,1.0,0.0,1.0);
     var blue = vec4(0.0,0.0,1.0,1.0);

     gl.uniform4fv(gl.getUniformLocation(program, "uAxisColor"),red);
     gl.drawArrays(gl.TRIANGLES,66,6);

     gl.uniform4fv(gl.getUniformLocation(program, "uAxisColor"),green);
     gl.drawArrays(gl.TRIANGLES,72,6);

     gl.uniform4fv(gl.getUniformLocation(program, "uAxisColor"),blue);
     gl.drawArrays(gl.TRIANGLES,78,6);
    requestAnimationFrame(render);
}

}

shadedCube();
