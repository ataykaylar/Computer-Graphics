var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var cMultiplication = 0;
var progShower = null;
var programVision = null;
var instanceMatrix;

var modelViewMatrixLoc;
var IDint = 0;
var keyframes = [];
var audioRun;
var kfTheta = [];
var keyframeInstance = [];
var colors = [];



var vertices = [
  vec4(-0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, 0.5, 0.5, 1.0),
  vec4(0.5, 0.5, 0.5, 1.0),
  vec4(0.5, -0.5, 0.5, 1.0),
  vec4(-0.5, -0.5, -0.5, 1.0),
  vec4(-0.5, 0.5, -0.5, 1.0),
  vec4(0.5, 0.5, -0.5, 1.0),
  vec4(0.5, -0.5, -0.5, 1.0)
];


var TORSO_ID = 0;
var TORSO_ID2=1;
var NECK_ID = 2;
var HEAD_ID = 3;
var HEAD1_ID = 3;
var HEAD2_ID = 14;
var LEFT_FRONT_LEG_ID = 6;
var LEFT_FRONT_FOOT_ID = 7;
var RIGHT_FRONT_LEG_ID = 8;
var RIGHT_FRONT_FOOT_ID = 9;
var LEFT_BACK_LEG_ID = 10;
var LEFT_BACK_FOOT_ID = 11;
var RIGHT_BACK_LEG_ID = 12;
var RIGHT_BACK_FOOT_ID = 13;
//

//var TORSO_ID2 = 15;

var torsoHeight = 7.8;
var torsoWidth = 3.2;
var upperArmHeight = 4.9;
var lowerArmHeight = 2.0;
var upperArmWidth = 1.5;
;
var headHeight = 3.7;
var headWidth = 1.5;
var neckHeight = 4.2;
var neckWidth = 1.9;


var lowerArmWidth = 0.8;
var upperLegWidth = 1.3;
var lowerLegWidth = 0.8;
var lowerLegHeight = 2.3;
var upperLegHeight = 5.1
var numNodes = 14;

var frameOn = 0;

//the angles for the parts
var theta = [90,-90, -180, 0, -180,-180,70, 10, 80, 10, 90, 40, 70, 30, 0, -90, 0, 0,0,0,60];


var knownLastIndex = 1;

var GLOBAL_ANGLE_ID = 15;
var GLOBAL_X_COORDINATE = 16;
var GLOBAL_Y_COORDINATE = 17;
var RIGHT_ARM_ID = 4;
var LEFT_ARM_ID = 5;
var GLOBAL_ANGLE_ID_2 = 18;



var figure = [];
var stack = [];


var vBuffer;
var modelViewLoc;
var soundsLoc = ["./Sounds/gallop.mp3", "./Sounds/gallop2.wav", "./Sounds/idle.wav"];

var pointsArray = [];
for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);
var vertexColors = [
  vec4(0.6, 0.32, 0.21, 1), 
  vec4(0.3, 0.3, 0.0, 1.0), 
  vec4(0.7, 0.3, 0.2, 1.0), 
  vec4(0.2, 0.45, 0.14, 1.0) 
];

function scale4(a, b, c) {
  var result = mat4();
  result[0][0] = a;
  result[1][1] = b;
  result[2][2] = c;
  return result;
}


function createNode(transform, render, sibling, child) {
  //console.log('iam here')
  var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
  }
  return node;
}

function initNodes(Id) {
  var m = mat4();

  switch (Id) {
    case TORSO_ID2:
      
      m = translate( 0, torsoHeight-1.5, 0);
      m = mult(m, rotate(-90, 1, 0, 0));
      m = mult(m, rotate(theta[TORSO_ID2]-90, 0, 1, 0));
      
      figure[TORSO_ID2] = createNode(m, torso2, LEFT_FRONT_LEG_ID, NECK_ID);
      break;

    case TORSO_ID:
        m = rotate(theta[GLOBAL_ANGLE_ID], 0,0 , 1);
        m = mult(m, rotate(theta[TORSO_ID], 0, 1, 0));
        m = mult(m, rotate(theta[GLOBAL_ANGLE_ID_2], 0, 0, 1));
        figure[TORSO_ID] = createNode(m, torso, null,TORSO_ID2);
        
        break;

    case NECK_ID:
      m = translate(0.0, torsoHeight - neckHeight + 3.5, 0.0);
      m = mult(m, rotate(theta[NECK_ID], 1, 0, 0))
      m = mult(m, rotate(theta[HEAD2_ID], 0, 1, 0));
      m = mult(m, translate(0.0, -1 * neckHeight, 0.0));
      figure[NECK_ID] = createNode(m, neck, RIGHT_ARM_ID, HEAD_ID);
      break;

    case RIGHT_ARM_ID:
    
      m = translate(-(torsoWidth / 3 + upperArmWidth)+1.5*torsoWidth, 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_ARM_ID], 1, 0, 0));
      figure[RIGHT_ARM_ID] = createNode(m, rightArm, LEFT_ARM_ID, null);
      break;

    case LEFT_ARM_ID:

      m = translate(-(torsoWidth / 3 + upperArmWidth), 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_ARM_ID], 1, 0, 0));
      figure[LEFT_ARM_ID] = createNode(m, leftArm, null, null);
      break;

    case HEAD_ID:
    case HEAD1_ID:
    case HEAD2_ID:

      m = translate(0.0, 0.2 * headHeight, 0.0);
      m = mult(m, rotate(theta[HEAD1_ID], 1, 0, 0))
      
      m = mult(m, translate(0.0, -0.8 * headHeight, 0.0));
      
      figure[HEAD_ID] = createNode(m, head, null, null);
      break;
    case LEFT_FRONT_LEG_ID:
     
      m = translate(-(torsoWidth / 3 + upperArmWidth), 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_FRONT_LEG_ID], 1, 0, 0));
      figure[LEFT_FRONT_LEG_ID] = createNode(m, leftUpperArm, RIGHT_FRONT_LEG_ID, LEFT_FRONT_FOOT_ID);
      break;

    case RIGHT_FRONT_LEG_ID:

      m = translate(torsoWidth / 3 + upperArmWidth, 0.9 * torsoHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_FRONT_LEG_ID], 1, 0, 0));
      figure[RIGHT_FRONT_LEG_ID] = createNode(m, rightUpperArm, LEFT_BACK_LEG_ID, RIGHT_FRONT_FOOT_ID);
      break;

    case LEFT_BACK_LEG_ID:

      m = translate(-(torsoWidth / 3 + upperLegWidth), 0.1 * upperLegHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_BACK_LEG_ID], 1, 0, 0));
      figure[LEFT_BACK_LEG_ID] = createNode(m, leftUpperLeg, RIGHT_BACK_LEG_ID, LEFT_BACK_FOOT_ID);
      break;

    case RIGHT_BACK_LEG_ID:

      m = translate(torsoWidth / 3 + upperLegWidth, 0.1 * upperLegHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_BACK_LEG_ID], 1, 0, 0));
      figure[RIGHT_BACK_LEG_ID] = createNode(m, rightUpperLeg, null, RIGHT_BACK_FOOT_ID);
      break;

    case LEFT_FRONT_FOOT_ID:

      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_FRONT_FOOT_ID], 1, 0, 0));
      figure[LEFT_FRONT_FOOT_ID] = createNode(m, leftLowerArm, null, null);
      break;

    case RIGHT_FRONT_FOOT_ID:

      m = translate(0.0, upperArmHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_FRONT_FOOT_ID], 1, 0, 0));
      figure[RIGHT_FRONT_FOOT_ID] = createNode(m, rightLowerArm, null, null);
      break;

    case LEFT_BACK_FOOT_ID:

      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[LEFT_BACK_FOOT_ID], 1, 0, 0));
      figure[LEFT_BACK_FOOT_ID] = createNode(m, leftLowerLeg, null, null);
      break;

    case RIGHT_BACK_FOOT_ID:

      m = translate(0.0, upperLegHeight, 0.0);
      m = mult(m, rotate(theta[RIGHT_BACK_FOOT_ID], 1, 0, 0));
      figure[RIGHT_BACK_FOOT_ID] = createNode(m, rightLowerLeg, null, null);
      break;
  }
}
//traverses the hierarchical nodes to make the model
function traverse(node) {
  if (node == null) return;

  stack.push(modelViewMatrix);
  //console.log(Id);
  modelViewMatrix = mult(modelViewMatrix, figure[node].transform);
  //console.log('iam');
  figure[node].render();
  if (figure[node].child != null) {
    traverse(figure[node].child);
  }
  modelViewMatrix = stack.pop();
  if (figure[node].sibling != null) {

    traverse(figure[node].sibling);
  }
}

function torso() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function torso2() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(torsoWidth, torsoHeight, torsoWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function head() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(2*headWidth, headHeight, headWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}



function leftUpperArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function neck() {
  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * neckHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(neckWidth/2, neckHeight, neckWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}



function rightUpperArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}
function rightLowerArm() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftUpperLeg() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function leftLowerLeg() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightUpperLeg() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth));
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

function rightLowerLeg() {

  instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth))
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
  for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}


//quad vertices for making cubes
function quad(a, b, c, d) {
  pointsArray.push(vertices[a]);
  pointsArray.push(vertices[b]);
  pointsArray.push(vertices[c]);
  pointsArray.push(vertices[d]);
}


function cube() {
  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(6, 5, 1, 2);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);

  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
 
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
  
  colors.push(vertexColors[0]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[2]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[1]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[3]);
  colors.push(vertexColors[0]);
  colors.push(vertexColors[3]);
}


window.onload = function init() {

  //these parts are not important, the audio parts
  audioRun = new Audio(soundsLoc[0]);


  audioRun.loop = true;

  document.getElementById('saveLoader').onchange = function() {

    kfTheta = [];
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(progressEvent) {
      var parts = this.result.split('|');
      for (var i = 1; i < parseInt(parts[0]) + 1; i++) {
        var allValues = parts[i].split(',');
        var someTheta = [];
        for (var f = 0; f < allValues.length + 10; f++) {
          console.log(allValues[f]);
          someTheta[f] = parseFloat(allValues[f]);
        }

        console.log(someTheta[0]);
        kfTheta.push(someTheta.slice());
      }

    };
    reader.readAsText(file);
    toastr["success"]("Animation is loaded", "Animation");
  }

  $("#save_all").click(function() 
  {
    if (kfTheta.length == 0) {
      kfTheta = keyframeInstance.slice();
    }

    var text = kfTheta.length + "|";
    for (var i = 0; i < kfTheta.length; i++)
      text += kfTheta[i] + "|";

    var filename = "animation"
    console.log("Saving");
    var blob = new Blob([text], {
      type: "text/plain;charset=utf-8"
    });
    this.href = URL.createObjectURL(blob);
    this.download = filename;
  });

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

 
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  instanceMatrix = mat4();
  
  projectionMatrix = ortho(-40.0, 40.0, -23.0, 23.0, -40.0, 40.0);
  modelViewMatrix = mat4();

  gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projectionMatrix));
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  cube();
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");

  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  
  gl.enableVertexAttribArray(vPosition);
 
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);
  document.getElementById("slider0").onchange = function() {
    theta[TORSO_ID2] = event.srcElement.value;
    initNodes(TORSO_ID2);
  };
  document.getElementById("slider1").onchange = function() {
    theta[HEAD1_ID] = event.srcElement.value;
    initNodes(HEAD1_ID);
  };

  document.getElementById("slider2").onchange = function() {
    //console.log(e);
    theta[LEFT_FRONT_LEG_ID] = event.srcElement.value;
    initNodes(LEFT_FRONT_LEG_ID);
  };
  document.getElementById("slider3").onchange = function() {
    theta[LEFT_FRONT_FOOT_ID] = event.srcElement.value;
    initNodes(LEFT_FRONT_FOOT_ID);
  };

  document.getElementById("slider4").onchange = function() {
    theta[RIGHT_FRONT_LEG_ID] = event.srcElement.value;
    initNodes(RIGHT_FRONT_LEG_ID);
  };
  document.getElementById("slider5").onchange = function() {
    theta[RIGHT_FRONT_FOOT_ID] = event.srcElement.value;
    initNodes(RIGHT_FRONT_FOOT_ID);
  };
  document.getElementById("slider6").onchange = function() {
    theta[LEFT_BACK_LEG_ID] = event.srcElement.value;
    initNodes(LEFT_BACK_LEG_ID);
  };
  document.getElementById("slider7").onchange = function() {
    theta[LEFT_BACK_FOOT_ID] = event.srcElement.value;
    initNodes(LEFT_BACK_FOOT_ID);
  };
  document.getElementById("slider8").onchange = function() {
    theta[RIGHT_BACK_LEG_ID] = event.srcElement.value;
    initNodes(RIGHT_BACK_LEG_ID);
  };
  document.getElementById("slider9").onchange = function() {
    theta[RIGHT_BACK_FOOT_ID] = event.srcElement.value;
    initNodes(RIGHT_BACK_FOOT_ID);
  };

  document.getElementById("slider10").onchange = function() {
    theta[HEAD2_ID] = event.srcElement.value;
    initNodes(NECK_ID);
  };

  document.getElementById("slider14").onchange = function() {
    theta[NECK_ID] = event.srcElement.value;
    initNodes(NECK_ID);
  };

  document.getElementById("slider11").onchange = function() {
    theta[GLOBAL_ANGLE_ID_2] = event.srcElement.value;
    initNodes(TORSO_ID);
  };

  document.getElementById("slider12").onchange = function() {
    theta[GLOBAL_X_COORDINATE] = event.srcElement.value - 400;
    gl.viewport(0 + theta[GLOBAL_X_COORDINATE], 0 + theta[GLOBAL_Y_COORDINATE], canvas.width, canvas.height);
    initNodes(TORSO_ID);
  };

  document.getElementById("slider13").onchange = function() {
    theta[GLOBAL_Y_COORDINATE] = event.srcElement.value - 400;
    gl.viewport(0 + theta[GLOBAL_X_COORDINATE], 0 + theta[GLOBAL_Y_COORDINATE], canvas.width, canvas.height);
    initNodes(TORSO_ID);
  };

  document.getElementById("sliderRA").onchange = function() {
    theta[RIGHT_ARM_ID] = event.srcElement.value;
    initNodes(RIGHT_ARM_ID);
  };

  document.getElementById("sliderLA").onchange = function() {
    theta[LEFT_ARM_ID] = event.srcElement.value;
    initNodes(LEFT_ARM_ID);
  };

  

  for (i = 0; i < numNodes; i++) initNodes(i);

  render();
}



var render = function() {
  gl.clear(gl.DEPTH_BUFFER_BIT);

  
  gl.clear(0, 0, 0, 0);
  traverse(TORSO_ID);
  requestAnimFrame(render);
}

function allNodesInit() {
  initNodes(TORSO_ID);
  initNodes(TORSO_ID2);
  initNodes(HEAD1_ID);
  initNodes(RIGHT_ARM_ID);

  initNodes(LEFT_ARM_ID);
  initNodes(NECK_ID);
  initNodes(LEFT_FRONT_LEG_ID);
  initNodes(LEFT_FRONT_FOOT_ID);


  
  initNodes(RIGHT_FRONT_LEG_ID);
  initNodes(RIGHT_FRONT_FOOT_ID);
  initNodes(LEFT_BACK_LEG_ID);
  initNodes(LEFT_BACK_FOOT_ID);
  initNodes(RIGHT_BACK_LEG_ID);
  initNodes(RIGHT_BACK_FOOT_ID);
  initNodes(HEAD2_ID);
}




function playAnimationOptimized() {
  
  if (kfTheta.length == 0) {
    if (IDint == 0) {
      kfTheta = keyframeInstance.slice();
      playAnimationOptimized();
      return;
    }
   
    clearInterval(IDint);
    IDint = 0;
    var audio = new Audio(soundsLoc[2]);
    audio.play();
    audioRun.pause();
    return;
  }

  var frameThetas = kfTheta.shift();
  theta = frameThetas.slice();
  allNodesInit();
  gl.viewport(0 + theta[GLOBAL_X_COORDINATE], 0 + theta[GLOBAL_Y_COORDINATE], canvas.width, canvas.height);
  if (IDint == 0) {
    audioRun.play();
    programVision = document.getElementById("animationPercent");
    progShower = programVision.children[0];

    if (kfTheta.length == 0) {
      kfTheta = keyframeInstance.slice();
    } else {
      console.log("Saving this keyframes for another play");
      keyframeInstance = kfTheta.slice();
    }
    frameOn = 1;
    cMultiplication = 100 / kfTheta.length;
    IDint = setInterval(playAnimationOptimized, 40);
  }
  var perc = Math.round(cMultiplication * (frameOn - 1));
  programVision.setAttribute("aria-valuenow", perc + "");
  programVision.setAttribute("style", "width:" + perc + "%");
  progShower.textContent = perc + "%";
  frameOn++;
}

//thakes the difference between two frames
function difference(frameCount, fFrame) {
  var lastFrame = kfTheta.pop();
  kfTheta.push(lastFrame);
  for (var i = 1; i < frameCount; i++) {
    var newTheta = theta.slice();
    for (var f = 0; f < fFrame.length; f++) {
      var someDiff = parseFloat(fFrame[f]) - parseFloat(lastFrame[f]);


      newTheta[f] = parseFloat(lastFrame[f]) + (someDiff / frameCount) * i;
    }
    kfTheta.push(newTheta);
  }
}

function saveFrame() {
  var indexedItem = document.getElementById("indexCount");
  var lastIndex = parseInt(indexedItem.value);
  
  if (lastIndex > knownLastIndex + 1) {
    var transitionFrameCount = lastIndex - knownLastIndex;
    difference(transitionFrameCount, theta.slice());
  } else {
    kfTheta.push(theta.slice());
    console.log("Frame Saved!", theta.slice());
  }
  knownLastIndex = lastIndex;
  indexedItem.value = lastIndex + 11;
  indexedItem.min = lastIndex + 11;
  toastr["success"]("Frame is set", "Keyframe");
}