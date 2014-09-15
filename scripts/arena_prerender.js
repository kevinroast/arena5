/**
 * Arena prerenderer class.
 * 
 * Encapsulates the early rendering of various effects used in the game. Each effect is
 * rendered once to a hidden canvas object, the image data is extracted and stored in an
 * Image object - which can then be reused later. This is much faster than rendering each
 * effect again and again at runtime.
 * 
 * The downside to this is that some constants are duplicated here and in the original
 * classes - so updates to the original classes such as the weapon effects etc. must be
 * duplicated here.
 * 
 * @namespace Arena
 * @class Arena.Prerenderer
 */
(function()
{
   Arena.Prerenderer = function()
   {
      Arena.Prerenderer.superclass.constructor.call(this);
      
      // function to generate a set of point particle images
      var fnPointRenderer = function(buffer, colour)
         {
            var imgs = [];
            for (var size=4; size<=10; size+=2)
            {
               var width = size << 1;
               buffer.width = buffer.height = width;
               var ctx = buffer.getContext('2d');
               var radgrad = ctx.createRadialGradient(size, size, size >> 1, size, size, size);  
               radgrad.addColorStop(0, colour);
               radgrad.addColorStop(1, "#000");
               ctx.fillStyle = radgrad;
               ctx.fillRect(0, 0, width, width);
               var img = new Image();
               img.src = buffer.toDataURL("image/png");
               imgs.push(img);
            }
            return imgs;
         };
      // add the various point particle image prerenderers based on above function
      // default explosion colour
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.PARTICLE);
         }, "points_" + Arena.Colours.PARTICLE);
      // Tracker: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_TRACKER);
         }, "points_" + Arena.Colours.ENEMY_TRACKER);
      // Borg: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_BORG);
         }, "points_" + Arena.Colours.ENEMY_BORG);
      // Dodger: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_DODGER);
         }, "points_" + Arena.Colours.ENEMY_DODGER);
      // Splitter: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_SPLITTER);
         }, "points_" + Arena.Colours.ENEMY_SPLITTER);
      // Bomber: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_BOMBER);
         }, "points_" + Arena.Colours.ENEMY_BOMBER);
      // Venom: enemy particles
      this.addRenderer(function(buffer) {
            return fnPointRenderer.call(this, buffer, Arena.Colours.ENEMY_VENOM);
         }, "points_" + Arena.Colours.ENEMY_VENOM);
      
      // function to generate a set of line particle images
      var fnLineRenderer = function(buffer, colour)
         {
            var imgs = [];
            var width = 8, height = 32;
            buffer.width = width;
            buffer.height = height;
            var ctx = buffer.getContext('2d');
            
            ctx.shadowBlur = Arena.ShadowSize;
            ctx.shadowColor = ctx.strokeStyle = colour;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(width/2, 2);
            ctx.lineTo(width/2, height-2-1);
            ctx.closePath();
            ctx.stroke();
            
            var img = new Image();
            img.src = buffer.toDataURL("image/png");
            imgs.push(img);
            return imgs;
         };
      // add the various line particle image prerenderers based on above function
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.PLAYER);
         }, "line_" + Arena.Colours.PLAYER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_DUMBO);
         }, "line_" + Arena.Colours.ENEMY_DUMBO);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_TRACKER);
         }, "line_" + Arena.Colours.ENEMY_TRACKER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_ZONER);
         }, "line_" + Arena.Colours.ENEMY_ZONER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_BORG);
         }, "line_" + Arena.Colours.ENEMY_BORG);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_DODGER);
         }, "line_" + Arena.Colours.ENEMY_DODGER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_SPLITTER);
         }, "line_" + Arena.Colours.ENEMY_SPLITTER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_BOMBER);
         }, "line_" + Arena.Colours.ENEMY_BOMBER);
      this.addRenderer(function(buffer) {
            return fnLineRenderer.call(this, buffer, Arena.Colours.ENEMY_VENOM);
         }, "line_" + Arena.Colours.ENEMY_VENOM);
      
      // Smudge explosion particle
      this.addRenderer(function(buffer) {
            var imgs = [];
            for (var size=8; size<=64; size+=8)
            {
               var width = size << 1;
               buffer.width = buffer.height = width;
               var ctx = buffer.getContext('2d');
               var radgrad = ctx.createRadialGradient(size, size, size >> 3, size, size, size);  
               radgrad.addColorStop(0, Arena.Colours.EXPLOSION);
               radgrad.addColorStop(1, "#000");
               ctx.fillStyle = radgrad;
               ctx.fillRect(0, 0, width, width);
               var img = new Image();
               img.src = buffer.toDataURL("image/png");
               imgs.push(img);
            }
            return imgs;
         }, "smudges");
      
      // Player weapon
      this.addRenderer(function(buffer) {
            var imgs = [];
            var size = 40;
            buffer.width = buffer.height = size;
            var ctx = buffer.getContext('2d');
            
            // draw bullet primary weapon
            var rf = function(width, height)
            {
               ctx.beginPath();
               ctx.moveTo(0, height);
               ctx.lineTo(width, 0);
               ctx.lineTo(width, -height);
               ctx.lineTo(0, -height*0.5);
               ctx.lineTo(-width, -height);
               ctx.lineTo(-width, 0);
               ctx.closePath();
               ctx.fill();
            };
            ctx.shadowBlur = Arena.ShadowSize;
            ctx.globalCompositeOperation = "lighter";
            ctx.translate(size/2, size/2);
            ctx.shadowColor = "rgb(255,255,255)";
            ctx.fillStyle = "rgb(255,220,75)";
            rf.call(this, 10, 15)
            ctx.shadowColor = "rgb(255,100,100)";
            ctx.fillStyle = "rgb(255,50,50)";
            rf.call(this, 10 * 0.75, 15 * 0.75);
            
            var img = new Image();
            img.src = buffer.toDataURL("image/png");
            imgs.push(img);
            return imgs;
         }, "playerweapon");
      
      // TODO: prerender Arena.EnemyBullet
      // TODO: smaller graphics/offset for iOS?! Will it allow ~256MB page? Turn off all glow effect when done.
      
      // Pickups
      this.addRenderer(function(buffer) {
            var imgs = [];
            var rad = 10;
            buffer.width = buffer.height = rad * 2 + 8;
            var ctx = buffer.getContext('2d');
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = Arena.ShadowSize;
            ctx.strokeStyle = ctx.shadowColor = Arena.Colours.COLLECTABLE_MULTIPLIER;
            ctx.translate(buffer.width/2, buffer.width/2);
            ctx.strokeRect(-rad * 0.6, -rad * 0.6, rad * 1.2, rad * 1.2);
            var img = new Image();
            img.src = buffer.toDataURL("image/png");
            imgs.push(img);
            return imgs;
         }, "multiplier");
      this.addRenderer(function(buffer) {
            var imgs = [];
            var rad = 12;
            buffer.width = buffer.height = rad * 2 + 8;
            var ctx = buffer.getContext('2d');
            ctx.lineWidth = 2.0;
            ctx.shadowBlur = Arena.ShadowSize;
            ctx.strokeStyle = ctx.shadowColor = Arena.Colours.COLLECTABLE_ENERGY;
            ctx.translate(buffer.width/2, buffer.width/2);
            ctx.strokeRect(-rad * 0.6, -rad * 0.6, rad * 1.2, rad * 1.2);
            var img = new Image();
            img.src = buffer.toDataURL("image/png");
            imgs.push(img);
            return imgs;
         }, "energyboost");
      
      // Player ship graphic
      this.addRenderer(function(buffer) {
            var imgs = [];
            
            var k3dController = new Arena.Controller(),
                obj = new Arena.K3DObject();
            with (obj)
            {
               drawmode = "wireframe";
               shademode = "depthcue";
               depthscale = 28;
               linescale = 3.5;
               perslevel = 256;
               color = [255,255,255];
               addphi = -1.0;
               scale = 0.8;
               init(
                  [{x:-30,y:-15,z:0}, {x:-10,y:-25,z:15}, {x:10,y:-25,z:15}, {x:30,y:-15,z:0}, {x:10,y:-25,z:-15}, {x:-10,y:-25,z:-15}, {x:0,y:40,z:0}, {x:0,y:5,z:15}, {x:0,y:5,z:-15}],
                  [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:4}, {a:4,b:5}, {a:5,b:0}, {a:1,b:7}, {a:7,b:2}, {a:5,b:8}, {a:8,b:4}, {a:7,b:6}, {a:6,b:8}, {a:0,b:6}, {a:3,b:6}, {a:1,b:5}, {a:2,b:4}],
                  []
               );
            }
            k3dController.addK3DObject(obj);
            
            for (var i=0; i<180; i++)
            {
               buffer.width = buffer.height = 64;
               var ctx = buffer.getContext('2d');
               ctx.lineWidth = 2.0;
               ctx.shadowBlur = Arena.ShadowSize;
               ctx.strokeStyle = ctx.shadowColor = Arena.Colours.PLAYER;
               ctx.translate(buffer.width/2, buffer.width/2 + 3);
               
               k3dController.render(ctx);
               
               var img = new Image();
               img.src = buffer.toDataURL("image/png");
               imgs.push(img);
            }
            return imgs;
         }, "playership");
      
      // enemy graphics
      var types = [0,1,2,3,4,5,6,7,99];
      for (var index in types)
      {
         if (!types.hasOwnProperty(index)) continue;
         var type = types[index],
             k3dController = new Arena.Controller(),
             obj = new Arena.K3DObject();
         
         with (obj)
         {
            drawmode = "wireframe";
            shademode = "depthcue";
            depthscale = 28;
            linescale = 3.5;
            perslevel = 256;
            
            switch (type)
            {
               case 0:
                  // Dumbo: blue stretched cubiod
                  k3dController.enemySize = 72;
                  k3dController.enemyFrames = 360;
                  k3dController.enemyColour = Arena.Colours.ENEMY_DUMBO;
                  
                  color = [0,128,255];
                  addphi = -1; addgamma = -1;
                  init(
                     [{x:-20,y:-20,z:15}, {x:-20,y:20,z:15}, {x:20,y:20,z:15}, {x:20,y:-20,z:15}, {x:-5,y:-5,z:-15}, {x:-5,y:5,z:-15}, {x:5,y:5,z:-15}, {x:5,y:-5,z:-15}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                     []);
                  break;
               
               case 1:
                  // Zoner: yellow diamond
                  k3dController.enemySize = 64;
                  k3dController.enemyFrames = 360;
                  k3dController.enemyColour = Arena.Colours.ENEMY_ZONER;
                  
                  color = [255,255,0];
                  addphi = 0.5; addgamma = -0.5; addtheta = -1.0;
                  init(
                     [{x:-20,y:-20,z:0}, {x:-20,y:20,z:0}, {x:20,y:20,z:0}, {x:20,y:-20,z:0}, {x:0,y:0,z:-20}, {x:0,y:0,z:20}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}, {a:0,b:5}, {a:1,b:5}, {a:2,b:5}, {a:3,b:5}],
                     []);
                  break;
               
               case 2:
                  // Tracker: red flattened square
                  k3dController.enemySize = 68;
                  k3dController.enemyFrames = 90;
                  k3dController.enemyColour = Arena.Colours.ENEMY_TRACKER;
                  
                  color = [255,96,0];
                  addgamma = 1.0;
                  init(
                     [{x:-20,y:-20,z:5}, {x:-20,y:20,z:5}, {x:20,y:20,z:5}, {x:20,y:-20,z:5}, {x:-15,y:-15,z:-5}, {x:-15,y:15,z:-5}, {x:15,y:15,z:-5}, {x:15,y:-15,z:-5}, {x:0,y:0,z:0}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}, {a:0,b:8}, {a:1,b:8}, {a:2,b:8}, {a:3,b:8}],
                     []);
                  break;
               
               case 3:
                  // Borg: big green cube
                  k3dController.enemyFrames = 90;
                  k3dController.enemyColour = Arena.Colours.ENEMY_BORG;
                  k3dController.enemySize = 128;   // tweak for larger object
                  
                  depthscale = 90;  // tweak for larger object
                  color = [0,255,64];
                  addphi = -1.0;
                  init(
                     [{x:-40,y:-40,z:40}, {x:-40,y:40,z:40}, {x:40,y:40,z:40}, {x:40,y:-40,z:40}, {x:-40,y:-40,z:-40}, {x:-40,y:40,z:-40}, {x:40,y:40,z:-40}, {x:40,y:-40,z:-40}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                     []);
                  break;
               
               case 4:
                  // Dodger: small cyan cube
                  k3dController.enemySize = 72;
                  k3dController.enemyFrames = 180;
                  k3dController.enemyColour = Arena.Colours.ENEMY_DODGER;
                  
                  color = [0,255,255];
                  addphi = 0.5; addtheta = -2.0;
                  init(
                     [{x:-20,y:-20,z:20}, {x:-20,y:20,z:20}, {x:20,y:20,z:20}, {x:20,y:-20,z:20}, {x:-20,y:-20,z:-20}, {x:-20,y:20,z:-20}, {x:20,y:20,z:-20}, {x:20,y:-20,z:-20}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                     []);
                  break;
               
               case 5:
                  // Splitter: medium purple pyrimid (converts to 2x smaller versions when hit)
                  k3dController.enemyFrames = 45;
                  k3dController.enemyColour = Arena.Colours.ENEMY_SPLITTER;
                  k3dController.enemySize = 72;    // tweak for larger object
                  
                  depthscale = 50;  // tweak for larger object
                  color = [148,0,255];
                  addphi = 2.0;
                  init(
                     [{x:-30,y:-20,z:0}, {x:0,y:-20,z:30}, {x:30,y:-20,z:0}, {x:0,y:-20,z:-30}, {x:0,y:30,z:0}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}],
                     []);
                  break;
               
               case 6:
                  // Bomber: medium magenta star - dodge bullets, dodge player!
                  k3dController.enemyFrames = 30;
                  k3dController.enemyColour = Arena.Colours.ENEMY_BOMBER;
                  k3dController.enemySize = 88;    // tweak for larger object
                  
                  depthscale = 50;  // tweak for larger object
                  color = [255,0,255];
                  addgamma = -3.0;
                  init(
                     [{x:-30,y:-30,z:10}, {x:-30,y:30,z:10}, {x:30,y:30,z:10}, {x:30,y:-30,z:10}, {x:-15,y:-15,z:-15}, {x:-15,y:15,z:-15}, {x:15,y:15,z:-15}, {x:15,y:-15,z:-15}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:4,b:5}, {a:5,b:6}, {a:6,b:7}, {a:7,b:4}, {a:0,b:4}, {a:1,b:5}, {a:2,b:6}, {a:3,b:7}],
                     []);
                  break;
               
               case 7:
                  // Venom: boss sphere - GOD HELP YOU MORTAL
                  // Generator code from "Tessellation of sphere" http://student.ulb.ac.be/~claugero/sphere/index.html
                  k3dController.enemyFrames = 90;
                  k3dController.enemyColour = Arena.Colours.ENEMY_VENOM;
                  k3dController.enemySize = 128;   // tweak for larger object
                  
                  depthscale = 90;  // tweak for larger object
                  color = [255,128,64];
                  scale = 60;
                  addphi = -2;
                  var t = (1+Math.sqrt(5))/2,
                      tau = t/Math.sqrt(1+t*t),
                      one = 1/Math.sqrt(1+t*t);
                  init(
                     [{x:tau,y:one,z:0}, {x:-tau,y:one,z:0}, {x:-tau,y:-one,z:0}, {x:tau,y:-one,z:0}, {x:one,y:0,z:tau}, {x:one,y:0,z:-tau}, {x:-one,y:0,z:-tau}, {x:-one,y:0,z:tau}, {x:0,y:tau,z:one}, {x:0,y:-tau,z:one}, {x:0,y:-tau,z:-one}, {x:0,y:tau,z:-one}],
                     [{a:4,b:8}, {a:8,b:7}, {a:7,b:4}, {a:7,b:9}, {a:9,b:4}, {a:5,b:6}, {a:6,b:11}, {a:11,b:5}, {a:5,b:10}, {a:10,b:6}, {a:0,b:4}, {a:4,b:3}, {a:3,b:0}, {a:3,b:5}, {a:5,b:0}, {a:2,b:7}, {a:7,b:1}, {a:1,b:2}, {a:1,b:6}, {a:6,b:2}, {a:8,b:0}, {a:0,b:11}, {a:11,b:8}, {a:11,b:1}, {a:1,b:8}, {a:9,b:10}, {a:10,b:3}, {a:3,b:9}, {a:9,b:2}, {a:2,b:10} ],
                     []
                  );
                  break;
               
               case 99:
                  // Splitter-mini: see Splitter above
                  k3dController.enemyFrames = 30;
                  k3dController.enemyColour = Arena.Colours.ENEMY_SPLITTER;
                  k3dController.enemySize = 40;    // tweak for smaller object
                  
                  depthscale = 15;  // tweak for smaller object
                  color = [148,0,255];
                  addphi = 3;
                  init(
                     [{x:-15,y:-10,z:0}, {x:0,y:-10,z:15}, {x:15,y:-10,z:0}, {x:0,y:-10,z:-15}, {x:0,y:15,z:0}],
                     [{a:0,b:1}, {a:1,b:2}, {a:2,b:3}, {a:3,b:0}, {a:0,b:4}, {a:1,b:4}, {a:2,b:4}, {a:3,b:4}],
                     []);
                  break;
            }
         }  // end with (obj)
         
         k3dController.addK3DObject(obj);
         
         // bind k3dController instance via an anonymous function and generate the function
         // that is responsible for later executing the controller during the prerender phase
         this.addRenderer( (function(k3d) {
               return function(buffer) {
                  var imgs = [];
                  for (var i=0; i<k3d.enemyFrames; i++)
                  {
                     buffer.width = buffer.height = k3d.enemySize;
                     var ctx = buffer.getContext('2d');
                     ctx.lineWidth = 2.0;
                     ctx.shadowBlur = Arena.ShadowSize;
                     ctx.strokeStyle = ctx.shadowColor = k3d.enemyColour;
                     ctx.translate(buffer.width/2, buffer.width/2);
                     k3d.render(ctx);
                     var img = new Image();
                     img.src = buffer.toDataURL("image/png");
                     imgs.push(img);
                  }
                  return imgs;
               };
            })(k3dController), "enemy-" + type);
      } // end for (types)
      
      return this;
   };
   
   extend(Arena.Prerenderer, Game.Prerenderer);
})();