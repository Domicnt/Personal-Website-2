var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight);
var material = new THREE.ShaderMaterial( {
	uniforms: {
		time: { value: 0 },
		resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
	},
	vertexShader: 
    `
    void main() {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
    }
    `,
	fragmentShader: 
    `
    uniform mediump float time;
    uniform mediump vec2 resolution;

    void main() {
        gl_FragColor = vec4(time, time, time, 1.0);
    }
    `
} );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );

//update uniform values
setInterval(() => {
    plane.material.uniforms.time.value = (Math.sin(Date.now() / 1000) + 1) / 2;
}, 10);

camera.position.z = 5;

function render() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
}
render();