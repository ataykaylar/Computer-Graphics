
function initShaders( gl, vsId, fsId )
{
    var vertexShader;
    var fragmentShader;

    var vertElem = document.getElementById( vsId );
    if (!vertElem) { 
        alert( "Unable to load vertex shader " + vsId );
        return -1;
    }
    else {
        vertexShader = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertexShader, vertElem.text );
        gl.compileShader( vertexShader );
        if ( !gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) ) {
            var msg = "Vertex shader failed to compile. ";
            alert( msg );
            return -1;
        }
    }
    var fragElem = document.getElementById( fsId );
    if ( !fragElem ) { 
        alert( "Unable to load vertex shader " + fsId );
        return -1;
    }
    else {
        fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragmentShader, fragElem.text );
        gl.compileShader( fragmentShader );
        if ( !gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) ) {
            var msg = "Fragment shader failed to compile. ";
            alert( msg );
            return -1;
        }
    }
    var program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link. ";
        alert( msg );
        return -1;
    }
    return program;
}
