/**
 * Enemy Ship actor class.
 * 
 * @namespace Arena
 * @class Arena.EnemyShip
 */
(function()
{
   Arena.EnemyShip = function(scene, type)
   {
      // enemy score multiplier based on type buy default - but some enemies
      // will tweak this in the individual setup code later
      this.type = this.scoretype = type;
      
      // generate enemy at start position - not too close to the player
      var p, v = null;
      while (!v)
      {
         p = new Vector(Rnd() * scene.world.size, Rnd() * scene.world.size);
         if (scene.player.position.distance(p) > 220)
         {
            v = new Vector(0,0);
         }
      }
      Arena.EnemyShip.superclass.constructor.call(this, p, v);
      
      // TODO: replace with anim state machine
      this.createdTime = GameHandler.frameStart;
      this.state = "spawning";
      this.frame = 0;
      
      // 3D sprite object - must be created after constructor call
      var me = this;
      var obj = new Arena.K3DObject();
      with (obj)
      {
         drawmode = "wireframe";
         shademode = "depthcue";
         depthscale = 28;
         linescale = 3;
         perslevel = 256;
         
         switch (type)
         {
            case 0:
               // Dumbo: blue stretched cubiod
               me.radius = 22;
               me.playerDamage = 10;
               me.colorRGB = Arena.Colours.ENEMY_DUMBO;
               color = [0,128,255];
               addphi = -0.75; addgamma = -0.50;
               init(
                  [{x:-20,y:-20,z:12}, {x:-20,y:20,z:12}, {x:20,y:20,z:12}, {x:20,y:-20,z:12}, {x:-10,y:-10,z:-12}, {x:-10,y:10,z:-12}, {x:10,y:10,z:-12}, {x:10,y:-10,z:-12}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                  []);
               break;
            
            case 1:
               // Zoner: yellow diamond
               me.radius = 22;
               me.playerDamage = 10;
               me.colorRGB = Arena.Colours.ENEMY_ZONER;
               color = [255,255,0];
               addphi = 0.35; addgamma = -0.35; addtheta = -0.75;
               init(
                  [{x:-20,y:-20,z:0}, {x:-20,y:20,z:0}, {x:20,y:20,z:0}, {x:20,y:-20,z:0}, {x:0,y:0,z:-20}, {x:0,y:0,z:20}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}, {a:0,b:5}, {a:1,b:5}, {a:2,b:5}, {a:3,b:5}],
                  []);
               break;
            
            case 2:
               // Tracker: red flattened square
               me.radius = 22;
               me.health = 2;
               me.playerDamage = 15;
               me.colorRGB = Arena.Colours.ENEMY_TRACKER;
               color = [255,96,0];
               addgamma = 0.75;
               init(
                  [{x:-20,y:-20,z:5}, {x:-20,y:20,z:5}, {x:20,y:20,z:5}, {x:20,y:-20,z:5}, {x:-15,y:-15,z:-5}, {x:-15,y:15,z:-5}, {x:15,y:15,z:-5}, {x:15,y:-15,z:-5}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                  []);
               break;
            
            case 3:
               // Borg: big green cube
               me.radius = 52;
               me.health = 5;
               me.playerDamage = 25;
               me.colorRGB = Arena.Colours.ENEMY_BORG;
               color = [0,255,64];
               depthscale = 96;  // tweak for larger object
               addphi = -1.0;
               init(
                  [{x:-40,y:-40,z:40}, {x:-40,y:40,z:40}, {x:40,y:40,z:40}, {x:40,y:-40,z:40}, {x:-40,y:-40,z:-40}, {x:-40,y:40,z:-40}, {x:40,y:40,z:-40}, {x:40,y:-40,z:-40}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                  []);
               break;
            
            case 4:
               // Dodger: small cyan cube
               me.radius = 25;
               me.health = 2;
               me.playerDamage = 10;
               me.colorRGB = Arena.Colours.ENEMY_DODGER;
               color = [0,255,255];
               addphi = 0.35; addtheta = -2.0;
               init(
                  [{x:-20,y:-20,z:20}, {x:-20,y:20,z:20}, {x:20,y:20,z:20}, {x:20,y:-20,z:20}, {x:-20,y:-20,z:-20}, {x:-20,y:20,z:-20}, {x:20,y:20,z:-20}, {x:20,y:-20,z:-20}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                  []);
               break;
            
            case 5:
               // Splitter: medium purple pyrimid (converts to 2x smaller versions when hit)
               me.radius = 25;
               me.health = 3;
               me.playerDamage = 20;
               me.colorRGB = Arena.Colours.ENEMY_SPLITTER;
               color = [148,0,255];
               depthscale = 56;  // tweak for larger object
               addphi = 2.0;
               init(
                  [{x:-30,y:-20,z:0}, {x:0,y:-20,z:30}, {x:30,y:-20,z:0}, {x:0,y:-20,z:-30}, {x:0,y:30,z:0}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}],
                  []);
               break;
            
            case 6:
               // Bomber: medium magenta star - dodge bullets, dodge player!
               me.radius = 28;
               me.health = 5;
               me.playerDamage = 20;
               me.colorRGB = Arena.Colours.ENEMY_BOMBER;
               color = [255,0,255];
               depthscale = 56;  // tweak for larger object
               addgamma = -3.5;
               init(
                  [{x:-30,y:-30,z:10}, {x:-30,y:30,z:10}, {x:30,y:30,z:10}, {x:30,y:-30,z:10}, {x:-15,y:-15,z:-15}, {x:-15,y:15,z:-15}, {x:15,y:15,z:-15}, {x:15,y:-15,z:-15}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                  []);
               break;
            
            case 99:
               // Splitter-mini: see Splitter above
               me.scoretype = 4;    // override default score type setting
               me.dropsMutliplier = false;
               me.radius = 12;
               me.health = 1;
               me.playerDamage = 5;
               me.colorRGB = Arena.Colours.ENEMY_SPLITTER;
               color = [148,0,255];
               depthscale = 16;  // tweak for smaller object
               addphi = 3.5;
               init(
                  [{x:-15,y:-10,z:0}, {x:0,y:-10,z:15}, {x:15,y:-10,z:0}, {x:0,y:-10,z:-15}, {x:0,y:15,z:0}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}],
                  []);
               break;
         }
      }
      this.setK3DObject(obj);
      
      // set misc default state
      this.bulletRecharge = GameHandler.frameStart;
      
      return this;
   };
   
   extend(Arena.EnemyShip, Arena.K3DActor,
   {
      BULLET_RECHARGE: 1500,
      SPAWN_LENGTH: 500,
      state: null,         // TODO: replace this with anim state machine
      createdTime: 0,
      type: 0,
      scoretype: 0,
      dropsMutliplier: true,
      health: 1,
      colorRGB: null,
      playerDamage: 0,
      bulletRecharge: 0,
      hit: false, // TODO: replace with state? - "extends" default render state...?
      frame: 0,
      
      onUpdate: function onUpdate(scene)
      {
         switch (this.state)
         {
            case "spawning":
            {
               if (GameHandler.frameStart >= this.createdTime + this.SPAWN_LENGTH)
               {
                  // transition from "spawning" to "alive" state
                  this.state = "alive";
                  // initial vector for some enemy types - others will set specifically later
                  this.vector = new Vector(4 * (Rnd < 0.5 ? 1 : -1), 4 * (Rnd < 0.5 ? 1 : -1));
               }
               break;
            }
            case "alive":
            {
               switch (this.type)
               {
                  case 0:
                     // DUMBO: change direction randomly
                     if (Rnd() < 0.01)
                     {
                        this.vector.y = -(this.vector.y + (0.35 - Rnd()));
                     }
                     break;
                  
                  case 1:
                     // ZONER: randomly reorientate towards player ("perception level")
                     // so player can avade by moving around them
                     if (Rnd() < 0.05)
                     {
                        // head towards player - generate a vector pointed at the player
                        // by calculating a vector between the player and enemy positions
                        var v = scene.player.position.nsub(this.position);
                        // scale resulting vector down to fixed vector size i.e. speed
                        this.vector = v.scaleTo(3);
                     }
                     break;
                  
                  case 2:
                     // TRACKER: very perceptive and faster - this one is mean
                     if (Rnd() < 0.25)
                     {
                        var v = scene.player.position.nsub(this.position);
                        this.vector = v.scaleTo(5.5);
                     }
                     break;
                  
                  case 3:
                     // BORG: randomly very fast dash towards player, otherwise it slows down
                     if (Rnd() < 0.03)
                     {
                        var v = scene.player.position.nsub(this.position);
                        this.vector = v.scaleTo(8);
                     }
                     else
                     {
                        this.vector.scale(0.95);
                     }
                     break;
                  
                  case 4:
                     // DODGER: perceptive and fast - and tries to dodgy bullets!
                     var dodged = false;
                     
                     // if we are close to the player then don't try and dodge,
                     // otherwise enemy might dash away rather than go for the kill
                     if (scene.player.position.nsub(this.position).length() > 150)
                     {
                        var p = this.position,
                            r = this.radius + 50;  // bullet "distance" perception
                        
                        // look at player bullets list - are any about to hit?
                        for (var i=0, j=scene.playerBullets.length, bullet, n; i < j; i++)
                        {
                           bullet = scene.playerBullets[i];
                           
                           // test the distance against the two radius combined
                           if (bullet.position.distance(p) <= bullet.radius + r)
                           {
                              // if so attempt a fast sideways dodge!
                              var v = bullet.position.nsub(p).scaleTo(7);
                              // randomise dodge direction a bit
                              v.rotate((n = Rnd()) < 0.5 ? n*PIO4 : -n*PIO4).invert();
                              this.vector = v;
                              dodged = true;
                              break;
                           }
                        }
                     }
                     if (!dodged && Rnd() < 0.04)
                     {
                        var v = scene.player.position.nsub(this.position);
                        this.vector = v.scaleTo(5.5);
                     }
                     break;
                  
                  case 5:
                     // SPLITTER: moves towards player - splits into 2 smaller versions when destroyed
                     if (Rnd() < 0.05)
                     {
                        var v = scene.player.position.nsub(this.position);
                        this.vector = v.scaleTo(3.5);
                     }
                     break;
                  
                  case 6:
                     // BOMBER: if we are too near the player move away
                     //         if we are too far from the player move towards
                     //         - then slowing down into a firing position
                     var v = scene.player.position.nsub(this.position);
                     if (v.length() > 400)
                     {
                        // move closer
                        if (Rnd() < 0.08) this.vector = v.scaleTo(6);
                     }
                     else if (v.length() < 350)
                     {
                        // move away
                        if (Rnd() < 0.08) this.vector = v.invert().scaleTo(6);
                     }
                     else
                     {
                        // slow down into a firing position
                        this.vector.scale(0.85);
                        
                        // reguarly fire at the player
                        if (GameHandler.frameStart - this.bulletRecharge > this.BULLET_RECHARGE &&
                            scene.player.alive)
                        {
                           GameHandler.playSound("enemy-bomb");
                           
                           // update last fired frame and generate a bullet
                           this.bulletRecharge = GameHandler.frameStart;
                           
                           // generate a vector pointed at the player
                           // by calculating a vector between the player and enemy positions
                           // then scale to a fixed size - i.e. bullet speed
                           var v = scene.player.position.nsub(this.position).scaleTo(8);
                           // slightly randomize the direction to apply some accuracy issues
                           v.x += (Rnd() * 2 - 1);
                           v.y += (Rnd() * 2 - 1);
                           
                           var bullet = new Arena.EnemyBullet(this.position.clone(), v, 10);
                           scene.enemyBullets.push(bullet);
                        }
                     }
                     break;
                  
                  case 99:
                     // SPLITTER: - mini version
                     if (Rnd() < 0.04)
                     {
                        var v = scene.player.position.nsub(this.position);
                        this.vector = v.scaleTo(6);
                     }
                     break;
               }
            }
         }
      },
      
      /**
       * Enemy rendering method
       * 
       * @param ctx {object} Canvas rendering context
       * @param world {object} World metadata
       */
      onRender: function onRender(ctx, world)
      {
         ctx.save();
         if (this.worldToScreen(ctx, world, this.radius))
         {
            // TODO: adjust RADIUS for collision etc. during spawn!
            // NOTE: will require adding a method to retrieve radius.
            if (this.state === "spawning")
            {
               // nifty scaling effect as an enemy spawns into position
               var scale = (GameHandler.frameStart - this.createdTime) / this.SPAWN_LENGTH;
               // account for the fact that time based state is not determinate
               // also handle FireFox bug with scale = 0! Will fail to render further canvas ops...
               if (scale <= 0) scale = 0.01;
               else if (scale > 1) scale = 1;
               ctx.scale(scale, scale);
            }
            
            // render 3D sprite
            if (DEBUG && DEBUG.K3DREALTIME)
            {
               ctx.shadowBlur = (DEBUG && DEBUG.DISABLEGLOWEFFECT) ? 0 : Arena.ShadowSize;
               
               if (!this.hit)
               {
                  ctx.shadowColor = this.colorRGB;
               }
               else
               {
                  // override colour with plain white for "hit" effect
                  ctx.shadowColor = "white";
                  var oldColor = this.k3dObject.color;
                  this.k3dObject.color = [255,255,255];
                  this.k3dObject.shademode = "plain";
               }
               
               this.renderK3D(ctx);
               
               if (this.hit)
               {
                  // restore colour and depthcue rendering mode
                  this.k3dObject.color = oldColor;
                  this.k3dObject.shademode = "depthcue";
                  this.hit = false;
               }
            }
            else
            {
               // calculate correct frame image to render
               var frame = Math.round(this.frame + 1 * GameHandler.frameMultipler),
                   imgs = GameHandler.bitmaps.images["enemy-" + this.type],
                   len = imgs.length;
               // update and loop framework counter
               if (frame >= len) frame -= len;
               this.frame = frame;
               // render the appropriate image
               if (this.hit)
               {
                  // double render in "lighter" mode for a retro weapon hit effect
                  ctx.globalCompositeOperation = "lighter";
                  ctx.drawImage(imgs[frame], imgs[frame].width * -0.5, imgs[frame].width * -0.5);
                  this.hit = false;
               }
               ctx.drawImage(imgs[frame], imgs[frame].width * -0.5, imgs[frame].width * -0.5);
               if (DEBUG && DEBUG.RENDERINGINFO)
               {
                  ctx.fillStyle = "white";
                  ctx.font = ~~(12 * world.scale * 2) + "pt Courier New";
                  ctx.fillText(frame, 16, 16);
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = "#aaa";
                  ctx.strokeRect(imgs[frame].width * -0.5, imgs[frame].width * -0.5, imgs[frame].width, imgs[frame].width);
               }
            }
         }
         ctx.restore();
      },
      
      damageBy: function damageBy(force)
      {
         // record hit - will change enemy colour for a single frame
         this.hit = true;
         if (force === -1 || (this.health -= force) <= 0)
         {
            this.alive = false;
         }
         return !this.alive;
      },
      
      onDestroyed: function onDestroyed(scene, player)
      {
         if (this.type === 5)
         {
            // Splitter enemy divides into two smaller ones
            var enemy = new Arena.EnemyShip(scene, 99);
            // update position and vector
            // TODO: move this as option in constructor
            enemy.vector = this.vector.nrotate(PIO2);
            enemy.position = this.position.nadd(enemy.vector);
            scene.enemies.push(enemy);
            
            enemy = new Arena.EnemyShip(scene, 99);
            enemy.vector = this.vector.nrotate(-PIO2);
            enemy.position = this.position.nadd(enemy.vector);
            scene.enemies.push(enemy);
         }
      }
   });
})();
