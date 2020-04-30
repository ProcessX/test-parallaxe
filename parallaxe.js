const parallaxeView = document.body.getElementsByClassName('parallaxe__view')[0];
const parallaxeContainer = document.body.getElementsByClassName('parallaxe__container')[0];
const simulatedCanvasHeight = 140;

//La hauteur du sol (par rapport à une hauteur d'écran de 200)
const groundHeight = 40;

let canvasScale = 1;
let groundColor = 0xf05c00;
let parallaxeSpeed = 1.45;




/*
PIXI
 */

let parallaxe = new PIXI.Application({
  view: parallaxeView,
  height: parallaxeView.height,
  width: parallaxeView.width,
});


//Change le resizing mode, afin de garder l'apparence des sprites en pixel art.
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;


//Init ground.
let ground = new PIXI.Graphics();
parallaxe.stage.addChild(ground);

//Init landscape -- groupe d'éléments positionné depuis le coin inférieur gauche du canvas
let landscape = new PIXI.Container();

//Init sky -- groupe d'éléments positionné depuis le coin supérieur gauche du canvas
let sky = new PIXI.Container();


//Character sprite
//let character;
//Group of characters
let horde = new PIXI.Container();

//Character animated texture (4 frames)
let characterAnimatedTexture;
//Character standing texture
let characterStandingTexture;

let loader = PIXI.Loader.shared;
//Preload assets
loader.baseUrl = 'assets';

loader
  .add('landscape_01', 'Dune-01.png')
  .add('landscape_02', 'Mountain-01.png')
  .add('characterWalking', 'characters/test/Figure-ThreeThird-Walking.json');

loader.onComplete.add(() => {
  initLandscape();
  loadCharacter();
});

loader.load();


parallaxe.ticker.add(() => {
  landscape.children.forEach((elem) => {
    elem.tilePosition.x -= elem.translationSpeed * parallaxeSpeed;
  });

});





/*
Other
 */
window.onresize = resizeCanvas;
resizeCanvas();


function resizeCanvas() {
  parallaxeView.height = parallaxeContainer.offsetHeight;
  parallaxeView.width = parallaxeContainer.offsetWidth;

  canvasScale = parallaxeView.height / simulatedCanvasHeight;

  setGround(groundColor);

  setLandscapeHeight();
}


//Ajoute les différentes couches du parallaxe - landscape (bas de l'écran)
function initLandscape(){
  let landscape_02 = new PIXI.TilingSprite(
    loader.resources.landscape_02.texture,
  );

  landscape_02.width = parallaxeView.width;
  landscape_02.height = landscape_02.texture.height;
  landscape_02.tileScale.x = 1 * canvasScale;
  landscape_02.anchor.y = 1;
  //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
  landscape_02.translationSpeed = 0.6;

  landscape.addChild(landscape_02);


  let landscape_01 = new PIXI.TilingSprite(
    loader.resources.landscape_01.texture,
  );

  landscape_01.width = parallaxeView.width;
  landscape_01.height = landscape_01.texture.height;
  landscape_01.tileScale.x = 1 * canvasScale;
  landscape_01.anchor.y = 1;

  //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
  landscape_01.translationSpeed = 1;

  landscape.addChild(landscape_01);


  landscape.scale.set(1, canvasScale);

  parallaxe.stage.addChild(landscape);
}


function setParallaxeElement(elem) {

}


//Ajoute un rectangle de couleur en bas du canvas (le sol)
function setGround(color){
  let groundTopLeftCorner = parallaxeView.height - (groundHeight * canvasScale);

  ground.clear();
  ground.beginFill(color);
  ground.drawRect(0, groundTopLeftCorner, parallaxeView.width, groundHeight * canvasScale);
  ground.endFill();
}


function setLandscapeHeight(){
  let landscapeTopLeftCorner = (parallaxeView.height - (groundHeight * canvasScale));
  landscape.y = landscapeTopLeftCorner;
}


function setParallaxeSpeed(speed){
  parallaxeSpeed = speed;
}


function loadCharacter() {
  characterAnimatedTexture = loader.resources["characterWalking"].spritesheet;

  let character = new PIXI.AnimatedSprite(characterAnimatedTexture.animations["walking"]);


  horde.addChild(character);
  horde.children.forEach((member) => {
    member.animationSpeed = 0.1;
    member.play();
  });

  parallaxe.stage.addChild(horde);
  setHorde();
}


function setHorde(){
  let hordeTopLeftCorner = parallaxeView.height - (groundHeight * canvasScale);
  horde.scale.set(canvasScale);
  horde.y = hordeTopLeftCorner;
}






/*
TEST
 */
const parralaxeSpeedRange = document.getElementById('test_parralaxeSpeed');
const parralaxeSpeedmeter = document.getElementById('test_parralaxeSpeedmeter');
parralaxeSpeedmeter.innerHTML = `Parralaxe speed = ${getRealSpeedRange(parralaxeSpeedRange.value)}`;

//parallaxeSpeed = getRealSpeedRange(parralaxeSpeedRange.value);

parralaxeSpeedRange.oninput = function () {
  parralaxeSpeedmeter.innerHTML = `Parralaxe speed = ${getRealSpeedRange(parralaxeSpeedRange.value)}`;
  //parallaxeSpeed = getRealSpeedRange(parralaxeSpeedRange.value);
}

function getRealSpeedRange(value){
  return (value - 1) / 100;
}