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
    uniform mediump int seed;
    uniform mediump int setup;
    uniform sampler2D sampler;
    uniform vec2[8] directions;

    float rand () {
        return fract(sin(dot(gl_FragCoord.xy/10.0, vec2(12.9898,78.233))) * 1.0 * float(seed));
    }

    void init () {
        float shade = rand();
        vec3 color = vec3(shade);
        gl_FragColor = vec4(color, 1);
    }

    void main() {
        vec2 pos = gl_FragCoord.xy / resolution;
        if (setup == 1) {
            init();
            return;
        }
        vec4 color = texture2D(sampler, pos.xy);
        color += (rand() - .5) *.05;
        gl_FragColor = color;
    }
`;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var bufferScene = new THREE.Scene();
var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
var bufferTexture2 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

var geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
var material = new THREE.ShaderMaterial( {
	uniforms: {
		sampler: {value: bufferTexture2.texture},
		resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        seed: {value: Date.now() % 1000},
        setup: {value: 1},
        directions: {value: [
            new THREE.Vector2(-1, -1),
            new THREE.Vector2(0, -1),
            new THREE.Vector2(1, -1),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(-1, 1),
            new THREE.Vector2(-1, 0),
        ]},
	},
	vertexShader: vertex,
	fragmentShader: fragment
} );
var plane = new THREE.Mesh( geometry, material );
bufferScene.add(plane);

var geometry2 = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
var material2 = new THREE.ShaderMaterial( {
	uniforms: {
		sampler: {value: bufferTexture.texture},
		resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        seed: {value: Date.now() % 1000},
        setup: {value: 1},
        directions: {value: [
            new THREE.Vector2(-1, -1),
            new THREE.Vector2(0, -1),
            new THREE.Vector2(1, -1),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1),
            new THREE.Vector2(-1, 1),
            new THREE.Vector2(-1, 0),
        ]},
	},
	vertexShader: vertex,
	fragmentShader: fragment
} );
var plane2 = new THREE.Mesh( geometry2, material2 );
scene.add(plane2);

camera.position.z = 5;

setInterval(() => {
    plane.material.uniforms.seed.value = Date.now() % 1000;
    plane2.material.uniforms.seed.value = Date.now() % 1000
}, 10);

function render() {
    requestAnimationFrame( render );
    renderer.setRenderTarget(bufferTexture);
    renderer.render(bufferScene,camera);
    renderer.setRenderTarget(null);

    renderer.setRenderTarget(bufferTexture2);
    renderer.render(scene,camera);
    renderer.setRenderTarget(null);

    renderer.render(scene, camera );
    plane.material.uniforms.setup.value = 0;
    plane2.material.uniforms.setup.value = 0;
}
render();