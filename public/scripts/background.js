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
    uniform int pointsCount;
    uniform vec2[200] points;
    uniform vec2[8] directions;

    void main() {
        vec2 pos = gl_FragCoord.xy / resolution;
        float shade = 1.0;
        float dist = 100.0;
        for (int i = 0; i < pointsCount; i++) {
            float dist2 = .0025 * sqrt(pow(gl_FragCoord.x - points[i].x, 2.0) + pow(gl_FragCoord.y - points[i].y, 2.0));
            if (dist2 < shade) {
                shade = dist2;
            }
        }
        vec3 color = vec3(shade);
        gl_FragColor = vec4(color, 1);
    }
`;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

var geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
var material = new THREE.ShaderMaterial( {
	uniforms: {
		resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        time: {value: Date.now()},
        pointsCount: {value: 0},
        points: {value: []},
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

var points = [];
var pointsCount = 200;
for (var i = 0; i < pointsCount; i++) {
    points.push(new THREE.Vector2(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
}
material.uniforms.points.value = points;
material.uniforms.pointsCount.value = pointsCount;

var plane = new THREE.Mesh( geometry, material );
scene.add(plane);

camera.position.z = 5;

setInterval(() => {
    plane.material.uniforms.time.value = Date.now();
}, 10);

function render() {
    requestAnimationFrame( render );
    renderer.setRenderTarget(bufferTexture);
    renderer.render(scene,camera);
    renderer.setRenderTarget(null);

    renderer.render(scene, camera );
}
render();