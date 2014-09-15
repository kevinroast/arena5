/**
 * Particle emitter effect actor class.
 * 
 * A simple particle emitter, that does not recycle particles, but sets itself as expired() once
 * all child particles have expired.
 * 
 * Requires a function known as the emitter that is called per particle generated.
 * 
 * @namespace Arena
 * @class Arena.Particles
 */
(function()
{
   /**
    * Constructor
    * 
    * @param p {Vector} Emitter position
    * @param v {Vector} Emitter velocity
    * @param count {Integer} Number of particles
    * @param fnEmitter {Function} Emitter function to call per particle generated
    */
   Arena.Particles = function(p, v, count, fnEmitter)
   {
      Arena.Particles.superclass.constructor.call(this, p, v);
      
      // generate particles based on the supplied emitter function
      this.particles = new Array(count);
      for (var i=0; i<count; i++)
      {
         this.particles[i] = fnEmitter.call(this, i);
      }
      
      return this;
   };
   
   extend(Arena.Particles, Game.Actor,
   {
      particles: null,
      
      /**
       * Particle effect rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender: function onRender(ctx, world)
      {
         ctx.save();
         for (var i=0, particle, viewposition; i<this.particles.length; i++)
         {
            particle = this.particles[i];
            
            // update particle and test for lifespan
            if (particle.update())
            {
               viewposition = Game.worldToScreen(particle.position, world, particle.size);
               if (viewposition)
               {
                  ctx.save();
                  ctx.translate(viewposition.x, viewposition.y);
                  ctx.scale(world.scale, world.scale);
                  particle.render(ctx);
                  ctx.restore();
               }
            }
            else
            {
               // particle no longer alive, remove from list
               this.particles.splice(i, 1);
            }
         }
         ctx.restore();
      },
      
      expired: function expired()
      {
         return (this.particles.length === 0);
      }
   });
})();


/**
 * Default Arena Particle structure.
 * Currently supports three particle types; dot, line and smudge.
 */
function ArenaParticle(position, vector, size, type, lifespan, fadelength, colour)
{
   this.position = position;
   this.vector = vector;
   this.size = size;
   this.type = type;
   this.lifespan = lifespan;
   this.fadelength = fadelength;
   this.colour = colour ? colour : Arena.Colours.PARTICLE;  // default colour if none set
   
   // randomize rotation speed and angle for line particle
   if (type === 1)
   {
      this.rotate = Rnd() * TWOPI;
      this.rotationv = (Rnd() - 0.5) * 0.5;
   }
   this.effectStart = GameHandler.frameStart;
   
   this.effectValue = function effectValue(val)
   {
      var result = val - ((val / this.lifespan) * (GameHandler.frameStart - this.effectStart));
      if (result < 0) result = 0;
      else if (result > val) result = val;
      return result;
   };
   
   this.update = function()
   {
      this.position.add(this.vector);
      return (GameHandler.frameStart - this.effectStart < this.lifespan);
   };
   
   this.render = function(ctx)
   {
      ctx.globalAlpha = this.effectValue(1.0);
      switch (this.type)
      {
         case 0:  // point
            // prerendered images for each enemy colour that support health > 1
            // lookup based on particle colour - "points_rgb(x,y,z)"
            ctx.globalCompositeOperation = "lighter";
            var offset = -(this.size + 4);
            ctx.drawImage(
               GameHandler.bitmaps.images["points_" + this.colour][this.size], offset, offset);
            break;
         case 1:  // line
            // prerendered images - fixed WxH of 8x32 - for each enemy and player colour
            // scaled vertically for line size against the fixed height - "line_rgb(x,y,z)"
            ctx.rotate(this.rotate);
            this.rotate += this.rotationv;
            ctx.drawImage(
               GameHandler.bitmaps.images["line_" + this.colour][0], -4, -8, 8, ~~(32 * (this.size/10)));
            break;
         case 2:  // smudge
            // prerendered images in a single fixed colour
            ctx.globalCompositeOperation = "lighter";
            var offset = -((this.size - 2) * 4 + 4);
   		  	ctx.drawImage(GameHandler.bitmaps.images["smudges"][this.size-2], offset, offset);
   		  	break;
      }
   };
}


/**
 * Enemy explosion - Particle effect actor class.
 * 
 * @namespace Arena
 * @class Arena.EnemyExplosion
 */
(function()
{
   /**
    * Constructor
    */
   Arena.EnemyExplosion = function(p, v, enemy)
   {
      Arena.EnemyExplosion.superclass.constructor.call(this, p, v, isFireFox ? 12 : 20, function(i)
         {
            // randomise start position slightly
            var pos = p.clone();
            pos.x += randomInt(-5, 5);
            pos.y += randomInt(-5, 5);
            // randomise radial direction vector - speed and angle, then add parent vector
            var ptype = randomInt(0,2);
            switch (ptype)
            {
               case 0:
                  var t = new Vector(0, randomInt(12, 15));
                  t.rotate(Rnd() * TWOPI);
                  t.add(v);
                  return new ArenaParticle(
                     pos, t, ~~(Rnd() * 4), 0, 1000, 300);
                  break;
               
               case 1:
                  var t = new Vector(0, randomInt(2, 5));
                  t.rotate(Rnd() * TWOPI);
                  t.add(v);
                  // create line particle - size based on enemy type
                  return new ArenaParticle(
                     pos, t, (enemy.type !== 3 ? Rnd() * 5 + 5 : Rnd() * 10 + 10), 1, 1000, 300, enemy.colorRGB);
                  break;
               
               case 2:
                  var t = new Vector(0, randomInt(1, 3));
                  t.rotate(Rnd() * TWOPI);
                  t.add(v);
                  return new ArenaParticle(
                     pos, t, ~~(Rnd() * 4 + 4), 2, 1000, 300);
                  break;
            }
         });
      
      return this;
   };
   
   extend(Arena.EnemyExplosion, Arena.Particles);
})();


/**
 * Enemy impact effect - Particle effect actor class.
 * Used when an enemy is hit by player bullet but not destroyed.
 * 
 * @namespace Arena
 * @class Arena.EnemyImpact
 */
(function()
{
   /**
    * Constructor
    */
   Arena.EnemyImpact = function(p, v, enemy)
   {
      Arena.EnemyImpact.superclass.constructor.call(this, p, v, 5, function()
         {
            // slightly randomise vector angle - then add parent vector
            var t = new Vector(0, Rnd() < 0.5 ? randomInt(-3, -8) : randomInt(3, 8));
            t.rotate(Rnd() * PIO2 - PIO4);
            t.add(v);
            return new ArenaParticle(
               p.clone(), t, ~~(Rnd() * 4), 0, 750, 250, enemy.colorRGB);
         });
      
      return this;
   };
   
   extend(Arena.EnemyImpact, Arena.Particles);
})();


/**
 * Bullet impact effect - Particle effect actor class.
 * Used when an bullet hits an object and is destroyed.
 * 
 * @namespace Arena
 * @class Arena.BulletImpactEffect
 */
(function()
{
   /**
    * Constructor
    */
   Arena.BulletImpactEffect = function(p, v, enemy)
   {
      Arena.BulletImpactEffect.superclass.constructor.call(this, p, v, 3, function()
         {
            return new ArenaParticle(
               p.clone(), v.nrotate(Rnd()*PIO8), ~~(Rnd() * 4), 0, 500, 200);
         });
      
      return this;
   };
   
   extend(Arena.BulletImpactEffect, Arena.Particles);
})();


/**
 * Player explosion - Particle effect actor class.
 * 
 * @namespace Arena
 * @class Arena.PlayerExplosion
 */
(function()
{
   /**
    * Constructor
    */
   Arena.PlayerExplosion = function(p, v)
   {
      Arena.PlayerExplosion.superclass.constructor.call(this, p, v, 20, function()
         {
            // randomise start position slightly
            var pos = p.clone();
            pos.x += randomInt(-5, 5);
            pos.y += randomInt(-5, 5);
            // randomise radial direction vector - speed and angle, then add parent vector
            switch (randomInt(1,2))
            {
               case 1:
                  var t = new Vector(0, randomInt(3, 5));
                  t.rotate(Rnd() * TWOPI);
                  t.add(v);
                  return new ArenaParticle(
                     pos, t, Rnd() * 5 + 5, 1, 1000, 300, Arena.Colours.PLAYER);
               case 2:
                  var t = new Vector(0, randomInt(3, 8));
                  t.rotate(Rnd() * TWOPI);
                  t.add(v);
                  return new ArenaParticle(
                     pos, t, ~~(Rnd() * 4 + 4), 2, 1000, 300);
            }
         });
      
      return this;
   };
   
   extend(Arena.PlayerExplosion, Arena.Particles);
})();


/**
 * Text indicator effect actor class.
 * 
 * @namespace Arena
 * @class Arena.TextIndicator
 */
(function()
{
   Arena.TextIndicator = function(p, v, msg, textSize, colour, fadeLength)
   {
      var flength = (fadeLength ? fadeLength : this.DEFAULT_FADE_LENGTH);
      Arena.TextIndicator.superclass.constructor.call(this, p, v, flength);
      this.msg = msg;
      if (textSize) this.textSize = textSize;
      if (colour) this.colour = colour;
      return this;
   };
   
   extend(Arena.TextIndicator, Game.EffectActor,
   {
      DEFAULT_FADE_LENGTH: 500,
      textSize: 22,
      msg: null,
      colour: "white",
      
      /**
       * Text indicator effect rendering method
       * 
       * @param ctx {object} Canvas rendering context
       */
      onRender: function onRender(ctx, world)
      {
         ctx.save();
         if (this.worldToScreen(ctx, world, 128))
         {
            ctx.globalAlpha = this.effectValue(1.0);
            Game.fillText(ctx, this.msg, this.textSize + "pt Courier New", 0, 0, this.colour);
         }
         ctx.restore();
      }
   });
})();


/**
 * Score indicator effect actor class.
 * 
 * @namespace Arena
 * @class Arena.ScoreIndicator
 */
(function()
{
   Arena.ScoreIndicator = function(p, v, score, textSize, prefix, colour, fadeLength)
   {
      var msg = score.toString();
      if (prefix)
      {
         msg = prefix + ' ' + msg;
      }
      Arena.ScoreIndicator.superclass.constructor.call(this, p, v, msg, textSize, colour, fadeLength);
      return this;
   };
   
   extend(Arena.ScoreIndicator, Arena.TextIndicator,
   {
   });
})();
