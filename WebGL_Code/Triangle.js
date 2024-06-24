"use strict";

var gl;
var points;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" ); // 브라우저 안에다가 512*512 윈도우를 그리고 그 안에만 오브젝트를 그린다

    gl = canvas.getContext('webgl2'); // 
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Initialize our data for a single triangle
    //

    // First, initialize the  three points.

     points = new Float32Array([
        -0.1, -0.1, // 첫 번째 점
        0,  0.1, // 두 번째 점
        0.1, -0.1, // 세 번째 점
       // Second Triangle
        1, -1, // 네 번째 점
        0,  1, // 다섯 번째 점
        2, -1  // 여섯 번째 점
        ]);

    //
    //  Configure WebGL 
    //
    gl.viewport( 0, 0, canvas.width, canvas.height ); // 카메라세팅
    gl.clearColor( 1.0, 0.5, 0.4, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" ); // initShader는 라이브러리로 사용
    gl.useProgram( program ); 

    // Load the data into the GPU

    var bufferId = gl.createBuffer(); // 버퍼 만들고 버퍼와 아이디 바인딩
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId ); // 메모리 버퍼를 만들어서 GPU로 보내기
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var aPosition = gl.getAttribLocation( program, "aPosition" ); //aPos로 이름을 바꿔줄 수도
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );  // 2차원이니깐 2개씩 읽기
    gl.enableVertexAttribArray( aPosition ); // 버텍스를 보내기

    render(); // clearbuffer, drawarray
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT ); // gl.으로 들어있는 함수들 : WebGL 자체에 있는 함수들
    gl.drawArrays( gl.TRIANGLES, 0, 6 );
}
