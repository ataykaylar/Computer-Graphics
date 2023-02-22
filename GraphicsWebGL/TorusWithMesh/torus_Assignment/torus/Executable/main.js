window.onload = function () {
  

//
//viewMatrix function for rotation and zooming in and out
//
function createViewMatrix(radius, xRotation, yRotation, zRotation) {
  var viewMatrix = mat4();
  viewMatrix = lookAt(vec3(0, 0, radius), vec3(0, 0, 0), vec3(0, 1, 0));
  viewMatrix = mult(viewMatrix, rotate(xRotation, vec3(1, 0, 0)));
  viewMatrix = mult(viewMatrix, rotate(yRotation, vec3(0, 1, 0)));
  viewMatrix = mult(viewMatrix, rotate(zRotation, vec3(0, 0, 1)));
  return viewMatrix;
}
  var d = 1;
  var torMode = 1;
  var wireframeOff = 1;
  var r = 1;
  var canvas = document.getElementById('render-surface');
  var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('Using experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl) {
    alert('Your browser doesn\'t support WEBGL');
  }
  //
  //binding the texture, and putting the depth tests
  //
  gl.bindTexture(gl.TEXTURE_2D, texture(gl, 'crate'));
  gl.activeTexture(gl.TEXTURE0);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 1.0);

  radius = 162;
  xRotation = 113;
  yRotation = 170;
  zRotation = 0;

  //
  //used for the camera and zooming in and out features
  //
  document.onkeydown = function (event) {
    let cameraSpeed = 2.5;
    
    console.log(cameraSpeed);
    switch (event.keyCode) {
    case 87:
      xRotation += cameraSpeed;
      
      break;

    case 68:
      zRotation -= cameraSpeed;
      break;

    case 65:
      zRotation += cameraSpeed;
     
      break;
    case 83:
      xRotation -= cameraSpeed;
     
      break;
    

    case 40:
      event.preventDefault();
      radius += cameraSpeed;
        
      break;

    case 37:
      yRotation -= cameraSpeed;
      
      break;
    case 38:
      event.preventDefault();
      radius -= cameraSpeed;
      
      break;
    case 39:
      yRotation += cameraSpeed;
     
      break;
   
    }
  };


  //
  //below are for the menu buttons
  //

  var rotationMode = 0;
  document.getElementById('toggleRotation').onclick = function () {
    rotationMode = (rotationMode + 1) % 2;
  };

  document.getElementById('changeTorus').onclick = function () {
    
    if(r%2==0)
        torMode = 1;
    else 
        torMode = 0;

    d++;
    console.log(d);
  };


  document.getElementById('wireframe').onclick = function () {
    
    if(r%2==0)
        wireframeOff = 1;
    else 
        wireframeOff = 0;

    r++;
    //render();
    //console.log(r);
  };

  document.getElementById('defcam').onclick = function () {
    radius = 162;
    xRotation = 113;
    yRotation = 170;
    zRotation = 0;
  };


  var torRadius = 1;
  document.getElementById('torRadius').oninput = function () {
    torRadius = document.getElementById('torRadius').value;
  };

  
  //
  //initializing the shaders
  //
  var program = initShaders(gl, 'vertexShader', 'fragmentShader');
  gl.useProgram(program);

  var viewMatrix;
  var projectionMatrix = perspective(radians(110), canvas.width / canvas.height, 0.1, 1000000.0);
  
  var i = 0;

  //
  //render function for creating a tor and putting it through the graphics pipeline via mesh
  //
  var render = function () {
   
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    viewMatrix = createViewMatrix(radius, xRotation, yRotation, zRotation);
    tor = toroid(torRadius,torMode);
    torKnot = new Mesh(tor[0], tor[1], tor[2]);
    torKnot.setScale(0.4);
    torKnot.setRotation(0, 180, i);
    torKnot.setWireMode(wireframeOff);
    torKnot.render(gl, program, viewMatrix, projectionMatrix);
  
    if (rotationMode === 0) {
      i += 0.2;
    }
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};


function texture(gl, name) {
  var ext = gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
  if (!ext) {
    ext = gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  }

  if (!ext) {
    alert('Anisopropic filtering not supported by your browser! Consider switching to Chrome, rendering qualite may be affected');
  }

  var image = document.getElementById(name);
  var t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (ext) {
    gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  }
  gl.texImage2D(gl.TEXTURE_2D, 0  , gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE,image);


  //
  //generate mips part
  //
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {

    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }
  gl.bindTexture(gl.TEXTURE_2D, null);

  return t;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}