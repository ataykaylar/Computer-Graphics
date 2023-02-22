"use strict";

var canvas;
var gl;
var currentPts = [];
var undoPts = [];
var points = [];
var points1 = [];
var colors = [];
var undoColors = [];
var pointsCopy;


var width = 12.0 * 0.001;
var mouseClicked = false;
var lineColor = [1, 0, 0];

var bufferId;
var cbufferId;
var maxNumberOfPoints = 100000;

function Snapshot (texture, paintingWidth, paintingHeight, resolutionScale) {
    this.texture = texture;
    this.paintingWidth = paintingWidth;
    this.paintingHeight = paintingHeight;
    this.resolutionScale = resolutionScale;
}

Snapshot.prototype.getTextureWidth = function () {
    return Math.ceil(this.paintingWidth * this.resolutionScale);
};

Snapshot.prototype.getTextureHeight = function () {
    return Math.ceil(this.paintingHeight * this.resolutionScale);
};



function clearFunction()
{
   // alert(points.toString);
    points = [];
    currentPts = [];
    colors = [];
    render();
}

function u3do()
{
    var unPoints = createLine(undoPts[0], undoPts[1]);
    points.pop(unPoints[0], unPoints[1], unPoints[2], unPoints[3]);
    render();  
}

function colorChange(value)
{
    lineColor = value.color.rgb;
}


function initialize()
{
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl)
     {
        alert("WebGL isn't available");
    }

    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumberOfPoints, gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");


    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

  
    cbufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumberOfPoints, gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

 
    canvas.addEventListener("mousemove", function(event) 
    {
        if (mouseClicked == true) {
            currentPts.push(vec2(-1 + 2*event.offsetX/canvas.width, -1 + 2*(canvas.height - event.offsetY)/canvas.height));
            undoPts.push(vec2(-1 + 2*event.offsetX/canvas.width, -1 + 2*(canvas.height - event.offsetY)/canvas.height));
            render();
            undoTracker();
        }
    });


    canvas.addEventListener("mouseup", function() 
    {
        mouseClicked = false;
        currentPts = [];
        undoPts = [];
    });
    canvas.addEventListener("mousedown", function() 
    {
        mouseClicked = true;
    });
   
    currentPts = [];
    render();
};
function undoTracker()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (currentPts.length ==2) {
        var tempPts = createLine(currentPts[0], currentPts[1]);
        points.push(tempPts[0], tempPts[1], tempPts[2], tempPts[3]);
        for (var i = 0; i < 4; ++i) {
            
            colors.push(lineColor[0], lineColor[1], lineColor[2]);
        }
        currentPts.shift();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));


    for (var i = 0; i < points.length /4; i++) 
    {
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
}



function undo()
{
    points.pop(pointsCopy);
    colors.pop(colorsCopy);
    render();
}

function createLine(begin, end)
{  
    var alpha; 
    alpha = (Math.PI/2.0) - Math.atan2(end[1] - begin[1], end[0] - begin[0]);
    var thetaX = Math.cos(alpha)*width;
    var thetaY = Math.sin(alpha)*width;
    return [vec2(begin[0] - thetaX, begin[1] + thetaY), vec2(begin[0] + thetaX, begin[1] - thetaY), vec2(end[0] + thetaX, end[1] - thetaY), vec2(end[0] - thetaX, end[1] + thetaY)];
}

window.onload = initialize;

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (currentPts.length ==2) {
        var temporary;
        temporary = createLine(currentPts[0], currentPts[1]);
        points.push(temporary[0], temporary[1], temporary[2], temporary[3]);
        for (var i = 0; i < 4; ++i)
        {    
            colors.push(lineColor[0], lineColor[1], lineColor[2]);
        }
        currentPts.shift();
        //pointsCopy = points;
        //colorsCopy = colors;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    for (var i = 0; i < points.length /4; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    }
   
}



function vec2()
{
    var result = [].concat.apply( [], Array.prototype.slice.apply(arguments) );

    switch ( result.length ) {
    case 0: result.push( 0.0 );
    case 1: result.push( 0.0 );
    }

    return result.splice( 0, 2 );
}



function length( u )
{
    return Math.sqrt( dot(u, u) );
}



function flatten( array )
{
    if ( array.matrix === true ) {
        array = transpose( array );
    }

    var n = array.length;
    var ifArrays = false;

    if ( Array.isArray(array[0]) ) {
        ifArrays = true;
        n =n* array[0].length;
    }

    var arr = new Float32Array( n );

    if ( ifArrays ) {
        var idx = 0;
        for ( var i = 0; i < array.length; ++i ) {
            for ( var j = 0; j < array[i].length; ++j ) {
                arr[idx++] = array[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < array.length; ++i ) {
            arr[i] = array[i];
        }
    }

    return arr;
}

var sizeof = {
    'vec2' : new Float32Array( flatten(vec2()) ).byteLength
    
};
