var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xff0000 );
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0, 1000 );

var vertex = `
    void main ()
    {
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
    }
`;
var fragment = `
    uniform mediump vec2 resolution;
    uniform mediump int setup;
    uniform sampler2D sampler;

    float rand (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 70058.54);
    }

    void main() {
        vec2 pos = gl_FragCoord.xy / resolution;
        if (setup == 1) {
            float shade = rand(pos);
            vec3 color = vec3(shade);
            gl_FragColor = vec4(color, 1.0);
        } else {
            gl_FragColor = texture2D(sampler, pos.xy + vec2(1.0/resolution.x, 1.0/resolution.y));
        }
    }
`;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var bufferScene = new THREE.Scene();
var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
var bufferTexture2 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

var geometry = new THREE.PlaneGeometry(window.innerWidth/2, window.innerHeight/2);
var material = new THREE.ShaderMaterial( {
	uniforms: {
		sampler: {value: bufferTexture2.texture},
		resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        setup: {value: 1},
	},
	vertexShader: vertex,
	fragmentShader: fragment
} );
var plane = new THREE.Mesh( geometry, material );
bufferScene.add(plane);

var geometry2 = new THREE.PlaneGeometry(window.innerWidth/2, window.innerHeight/2);
var material2 = new THREE.ShaderMaterial( {
	uniforms: {
		sampler: {value: bufferTexture.texture},
		resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        setup: {value: 0},
	},
	vertexShader: vertex,
	fragmentShader: fragment
} );
var plane2 = new THREE.Mesh( geometry2, material2 );
scene.add(plane2);

//update uniform values
setTimeout(() => {
    plane.material.uniforms.setup.value = 0;
}, 1000);

camera.position.z = 5;

function render() {
    requestAnimationFrame( render );
    renderer.setRenderTarget(bufferTexture);
    renderer.render(bufferScene,camera);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(bufferTexture2);
    renderer.render(scene,camera);
    renderer.setRenderTarget(null);

    renderer.render(scene, camera );
}
render();