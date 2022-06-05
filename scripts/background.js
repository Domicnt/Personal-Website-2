var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xff0000 );
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0, 1000 );
var width = window.innerWidth;
var height = window.innerHeight;

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
    uniform vec2[50] points;
    uniform vec2[8] directions;

    void main() {
        vec2 pos = gl_FragCoord.xy / resolution;
        float shade = 1.0;
        for (int i = 0; i < pointsCount; i++) {
            float dist2 = .0025 * sqrt(pow(gl_FragCoord.x - points[i].x, 2.0) + pow(gl_FragCoord.y - points[i].y, 2.0));
            if (dist2 < shade) {
                shade = dist2;
            }
        }
        shade += .66;
        shade *= .5;
        vec3 color = vec3(shade * 1.3, shade * 1.3, shade * 1.7);
        gl_FragColor = vec4(color, 1);
    }
`;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.PlaneGeometry(width, height);
var material = new THREE.ShaderMaterial( {
	uniforms: {
		resolution: {value: new THREE.Vector2(width, height) },
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
var pointsCount = 50;
for (var i = 0; i < pointsCount; i++) {
    points.push(new THREE.Vector2(Math.random() * width, Math.random() * height));
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
    renderer.render(scene, camera );
}
render();