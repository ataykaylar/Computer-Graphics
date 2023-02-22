function toroid(torRadius, complexKnot) {

  //big m and big n are 61
  var N = 61;
  var M = 61;
  
  var rad = torRadius;
  //console.log(rad);
  var vertices = new Float32Array(3 * (N + 1) * (M + 1));
  var normals = new Float32Array(3 * (N + 1) * (M + 1));
  var textureCoords = new Float32Array(2 * (N + 1) * (M + 1));
  var longitude = new Float32Array(N + 1);
  var latitude = new Float32Array(M + 1);


  //
  //below are the functions that constucts the vertex coordinates and normals
  //with using the parametric equation for each dimension
  //
  for (let i = 0; i <= N; i++) {
    for (let j = 0; j <= M; j++) {
      let u = (2 * Math.PI / M) * j - Math.PI;
      let v = (2 * Math.PI / N) * i - Math.PI;
      if(complexKnot)
      {
        vertices[3 * (i * (M + 1) + j)] = xv1(u, v);
        vertices[3 * (i * (M + 1) + j) + 1] = yv1(u, v);
        vertices[3 * (i * (M + 1) + j) + 2] = zv1(u, v);
        normals[3 * (i * (M + 1) + j)] = xn1(u, v);
        normals[3 * (i * (M + 1) + j) + 1] = yn1(u, v);
        normals[3 * (i * (M + 1) + j) + 2] = zn1(u, v);
        
      }
      else{
      vertices[3 * (i * (M + 1) + j)] = xv(u, v);
      vertices[3 * (i * (M + 1) + j) + 1] = yv(u, v);
      vertices[3 * (i * (M + 1) + j) + 2] = zv(u, v);
      normals[3 * (i * (M + 1) + j)] = xn(u, v);
      normals[3 * (i * (M + 1) + j) + 1] = yn(u, v);
      normals[3 * (i * (M + 1) + j) + 2] = zn(u, v);
      }
      let x1 = 0;
      let x2 = 0;
      let y1 = 0;
      let y2 = 0;
      let z1 = 0;
      let z2 = 0;
      let d = 0;
      if (i > 0) {
        x1 = vertices[3 * ((i - 1) * (M + 1) + j)];
        y1 = vertices[3 * ((i - 1) * (M + 1) + j) + 1];
        z1 = vertices[3 * ((i - 1) * (M + 1) + j) + 2];
        x2 = vertices[3 * (i * (M + 1) + j)];
        y2 = vertices[3 * (i * (M + 1) + j) + 1];
        z2 = vertices[3 * (i * (M + 1) + j) + 2];
        d = distance(x1, y1, z1, x2, y2, z2);
        latitude[j] += d;
        
      }
      if (j > 0) {
        x1 = vertices[3 * (i * (M + 1) + j - 1)];
        y1 = vertices[3 * (i * (M + 1) + j - 1) + 1];
        z1 = vertices[3 * (i * (M + 1) + j - 1) + 2];
        x2 = vertices[3 * (i * (M + 1) + j)];
        y2 = vertices[3 * (i * (M + 1) + j) + 1];
        z2 = vertices[3 * (i * (M + 1) + j) + 2];
        d = distance(x1, y1, z1, x2, y2, z2);
        longitude[i] += d;
      }
    }
  }


  //
  //making the texture coordinates
  //
  for (let i = 0; i <= N; i++) {
    let d = 0;
    for (let j = 0; j <= M; j++) {
      if (j == 0) {
        textureCoords[2 * (i * (M + 1) + j)] = 0;
      } else {
        x1 = vertices[3 * (i * (M + 1) + j - 1)];
        y1 = vertices[3 * (i * (M + 1) + j - 1) + 1];
        z1 = vertices[3 * (i * (M + 1) + j - 1) + 2];
        x2 = vertices[3 * (i * (M + 1) + j)];
        y2 = vertices[3 * (i * (M + 1) + j) + 1];
        z2 = vertices[3 * (i * (M + 1) + j) + 2];
        d += distance(x1, y1, z1, x2, y2, z2);
        textureCoords[2 * (i * (M + 1) + j)] = d / longitude[i];
      }
    }
  }
  for (let j = 0; j < M + 1; j++) {
    let d = 0;
    for (let i = 0; i < N + 1; i++) {
      if (i == 0) {
        textureCoords[2 * (i * (M + 1) + j) + 1] = textureCoords[2 * ((M + 1) + j) + 1];
      } else if (j == M) {
        textureCoords[2 * (i * (M + 1) + j) + 1] = textureCoords[2 * (i * (M + 1)) + 1];
      } else {
        x1 = vertices[3 * ((i - 1) * (M + 1) + j)];
        y1 = vertices[3 * ((i - 1) * (M + 1) + j) + 1];
        z1 = vertices[3 * ((i - 1) * (M + 1) + j) + 2];
        x2 = vertices[3 * (i * (M + 1) + j)];
        y2 = vertices[3 * (i * (M + 1) + j) + 1];
        z2 = vertices[3 * (i * (M + 1) + j) + 2];
        d += distance(x1, y1, z1, x2, y2, z2);
        textureCoords[2 * (i * (M + 1) + j) + 1] = d / latitude[j];
      }
    }
  }
  for (let j = 0; j <= M; j++) {
    textureCoords[2 * j] = textureCoords[2 * ((M + 1) + j)];
    textureCoords[2 * (N * (M + 1) + j)] = textureCoords[2 * ((N - 1) * (M + 1) + j)];
  }

 

 
  function xv(u, v) {
    //console.log("hello");
    //return 4*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
  
    return torusFunction(u,v)[0];
    
  }
  
  function yv(u, v) {
    //return 4*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
    return torusFunction(u,v)[1];
  };

  
  function zv(u, v) {
    //return sin(v)+0.35*sin(5*u);
    return torusFunction(u,v)[2];
  };

  
  function xn(u, v) {
    //return 4*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
    return torusFunction(u,v)[0];
  };

 
  function yn(u, v) {
    //return  4*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u))); 
    return torusFunction(u,v)[1];
  };

  
  function zn(u, v) {
    //return sin(v)+0.35*sin(5*u);
    return torusFunction(u,v)[2];
  };


  //
  //below are for the complex knot that the assignment asks for
  //
  function xv1(u, v) {
    //console.log("hello");
    return 4*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
  
    //return torusFunction(u,v)[0];
    
  }
  
  function yv1(u, v) {
    return 4*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
    //return torusFunction(u,v)[1];
  };

  
  function zv1(u, v) {
    return sin(v)+0.35*sin(5*u);
    //return torusFunction(u,v)[2];
  };

  
  function xn1(u, v) {
    return 4*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));
    //return torusFunction(u,v)[0];
  };

 
  function yn1(u, v) {
    return  4*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*sin(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u))); 
    //return torusFunction(u,v)[1];
  };

  
  function zn1(u, v) {
    return sin(v)+0.35*sin(5*u);
    //return torusFunction(u,v)[2];
  };


  function distance(x1, y1, z1, x2, y2, z2) {
    var xSquare = (x2 - x1) * (x2 - x1);
    var ySquare = (y2 - y1) * (y2 - y1);
    var zSquare = (z2 - z1) * (z2 - z1);
    return Math.sqrt(xSquare + ySquare + zSquare);
  };
  //console.log(latitude[0]);
  function sin(x){
    return Math.sin(x);
  }
  
  function cos(x){
    return Math.cos(x);
  }
  function f(u,y) {
    var rr= y;
    //console.log(rr);
    var xx=rr*((2+cos(2*u))*cos(3*u));
    var yy=rr*((2+cos(2*u))*sin(3*u));
    var zz=3*sin(4*u);
    
    var x = xx;
    var y = yy;
    var z = zz;
    
    var scale = 1;  
    var vec = [x, y, z];  
    return vec;    
  }
  function circleFunction(xx,yy,zz, phi){
    //var rr=(Math.cos(qq*u)+2);
    x=(4*xx+cos(phi)*xx);
    y=(4*yy+cos(phi)*yy);
    z=sin(phi)+zz;
    //here is the equation of the torus with inner circle parameterization
    var res = [ x,y,z];
    return res;
  }
  
  
  function torusFunction(u,v) {
    //u=u*(2*Math.PI);
    //v=v*(2*Math.PI);
    var theta = u;
    var phi=v;
    var pp=1;
    var qq=5;
  
    //var vec = f(pp,qq,phi,u);
    var vec = f(theta, getRadius());
    var tor = circleFunction(vec[0], vec[1], vec[2],  phi);
    return tor;
   
  }
 function getRadius()
 {
   return rad;
 };

  return [vertices, textureCoords, normals, rad];
};

//return 4*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)))+cos(v)*cos(2*u)*(1+0.6*(cos(5*u)+0.75*cos(10*u)));