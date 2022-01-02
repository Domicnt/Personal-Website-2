`
if (setup == 1) {
    float shade = rand(pixelCoord);
    vec3 color = vec3(shade);
    gl_FragColor = vec4(color, 1.0);
} else {
    gl_FragColor = texture2D(sampler, vec2(.5, .5)).rgba;
}
`


var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffff00 );
var width = window.innerWidth;
var height = window.innerHeight;
var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

///////////////////This is where we create our off-screen render target
//Create a different scene to hold our buffer objects
var bufferScene = new THREE.Scene();
//Create the texture that will store our result
var bufferTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
scene.background = bufferTexture.texture;

//Let's create a red box
var redMaterial = new THREE.MeshBasicMaterial({color:0xF06565});
var boxGeometry = new THREE.BoxGeometry( 5, 5, 5 );
var boxObject = new THREE.Mesh( boxGeometry, redMaterial );
boxObject.position.z = -10; 
bufferScene.add(boxObject);//We add it to the bufferScene instead of the normal scene!

////////////////////////////Now we use our bufferTexture as a material to render it onto our main scene
var boxMaterial = new THREE.MeshBasicMaterial({map:bufferTexture.texture});
var boxGeometry2 = new THREE.PlaneGeometry( 5, 5);
var mainBoxObject = new THREE.Mesh(boxGeometry2,boxMaterial);
mainBoxObject.position.z = -10;
scene.add(mainBoxObject);

//Render everything!
function render() {

  requestAnimationFrame( render );

  //Make the box rotate on box axises
  boxObject.rotation.y += 0.01;
  boxObject.rotation.x += 0.01;
  
  //Render onto our off screen texture
  renderer.setRenderTarget(bufferTexture);
  renderer.render(bufferScene,camera,bufferTexture);
  renderer.setRenderTarget(null);


  //Finally, draw to the screen
  renderer.render( scene, camera );

}
render();