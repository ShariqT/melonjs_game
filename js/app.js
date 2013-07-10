var game = {




    // game assets
    assets : [  
        {name: "light_forest_tileset_0", type:"image",   src: "data/gfx/light_forest_tileset_0.png"},
        {name: "hero_animate", type:"image", src: "data/gfx/hero_animate.png"},
        {name: "metatiles32x32", type: "image",src: "data/gfx/metatiles32x32.png"},
        {name: "golden_acron", type: "image", src: "data/gfx/acron.png"},
        // level map
        {name: "map1", type: "tmx",    src: "data/map/acron_game.json"}
    ],
    
    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init("screen", 640, 480, true, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
         
        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function () {
                me.plugin.register.defer(debugPanel, "debug");
            });
        }
 
        // Initialize the audio.
        me.audio.init("mp3,ogg");
 
        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);
      
        // Load the resources.
        me.loader.preload(game.assets);
 
        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
 
 
 
    // Run on game resources loaded.
    "loaded" : function () {
        //me.state.set(me.state.MENU, new TitleScreen());
        me.state.set(me.state.PLAY, new PlayScreen());
         me.entityPool.add("mainPlayer", game.PlayerEntity);
         me.entityPool.add("acron", game.Acron);
         me.input.bindKey(me.input.KEY.DOWN, "down");
         me.input.bindKey(me.input.KEY.UP, "up");
         me.input.bindKey(me.input.KEY.LEFT, "left");
         me.input.bindKey(me.input.KEY.RIGHT, "right");
        // Start the game.
        me.state.change(me.state.PLAY);
    }
};

var PlayScreen = me.ScreenObject.extend({
    onResetEvent: function(){
        me.levelDirector.loadLevel("map1");

    },

    onDestroyEvent: function(){}
});


game.PlayerEntity = me.ObjectEntity.extend({
 
    /* -----
 
    constructor
 
    ------ */
 
    init: function(x, y, settings) {
        // call the constructor
        settings.image = "hero_animate";
        settings.spritewidth = 32;
        settings.spriteheight = 32;
        this.parent(x, y, settings);

        
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.gravity = 0;
        //this is where I define the animations. the array in the
        //addAnimation method corresponds to positions in the hero
        //animate file.
        this.renderable.addAnimation("down", [0,1,2]);
        this.renderable.addAnimation("left", [3,4,5]);
        this.renderable.addAnimation("right", [6,7,8]);
        this.renderable.addAnimation("up", [9,10,11]);
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(3, 3);
        this.renderable.setCurrentAnimation("down"); 
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function() {
        
        if(me.input.isKeyPressed('down')){
            this.vel.y += this.accel.y * me.timer.tick;
            this.renderable.setCurrentAnimation("down");
        }else if( me.input.isKeyPressed('up')){
            this.vel.y -= this.accel.y * me.timer.tick;
            this.renderable.setCurrentAnimation("up");
        }else{
            this.vel.y = 0;
        }


        if(me.input.isKeyPressed('right')){
            this.vel.x += this.accel.y * me.timer.tick;
            this.renderable.setCurrentAnimation("right");
        }else if( me.input.isKeyPressed('left')){
            this.vel.x -= this.accel.y * me.timer.tick;
            this.renderable.setCurrentAnimation("left");
        }else{
            this.vel.x = 0;
        }        

        
 
        // check & update player movement
        this.updateMovement();

        var res = me.game.collide(this);
 
        // update animation if necessary
        if (this.vel.x!=0 || (this.vel.y!=0 && (this.pos.y + this.vel.y > 0 && this.pos.y + this.vel.y < me.game.viewport.getHeight() ) ) ) {
            console.log("this is the y: "  + (this.pos.y + this.vel.y));
            console.log("this is the getHeight: " + me.game.viewport.getHeight());
            this.parent();
            return true;
        }
         
        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    }
 
});


game.Acron = me.CollectableEntity.extend({
    init: function(x, y, settings){
        settings.x = 300;
        settings.y = 100;
        settings.image = "golden_acron";
        settings.spritewidth = 64;
        this.parent(x, y, settings);
    },

    onCollision: function(){
        this.collidable = false;
        me.game.remove(this);
    }
});

 /* Bootstrap */
window.onReady(function onReady() {
    game.onload();
});