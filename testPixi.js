let app = new PIXI.Application({
  height: 500,
  width: 500,

});

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add("img02.png")
  .load(setup);

function setup() {
  let sprite = new PIXI.Sprite(
    PIXI.loader.resources["img02.png"].texture
  );

  sprite.width = 256;
  sprite.height = 256;

  app.stage.addChild(sprite);
}

document.body.appendChild(app.view);
