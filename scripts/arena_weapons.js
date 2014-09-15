/**
 * Weapon system base class for the player actor.
 * 
 * @namespace Arena
 * @class Arena.Weapon
 */
(function()
{
   Arena.Weapon = function(player)
   {
      this.player = player;
      return this;
   };
   
   Arena.Weapon.prototype =
   {
      WEAPON_RECHARGE: 125,
      weaponRecharge: 0,
      player: null,
      
      fire: function(v, h)
      {
         // now test we did not fire too recently
         if (GameHandler.frameStart - this.weaponRecharge > this.WEAPON_RECHARGE)
         {
            // ok, update last fired time and we can now generate a bullet
            this.weaponRecharge = GameHandler.frameStart;
            
            return this.doFire(v, h);
         }
      },
      
      doFire: function(v, h)
      {
      }
   };
})();


/**
 * Basic primary weapon for the player actor.
 * 
 * @namespace Arena
 * @class Arena.PrimaryWeapon
 */
(function()
{
   Arena.PrimaryWeapon = function(player)
   {
      Arena.PrimaryWeapon.superclass.constructor.call(this, player);
      return this;
   };
   
   extend(Arena.PrimaryWeapon, Arena.Weapon,
   {
      bulletCount: 1,   // increase this to output more intense bullet stream
      
      doFire: function(vector, heading)
      {
         // start playing a sound
         GameHandler.playSound("laser");
         
         var bullets = [],
             count = this.bulletCount,
             total = (count > 2 ? randomInt(count - 1, count) : count);
         for (var i=0; i<total; i++)
         {
            // slightly randomize the spread based on bullet count
            var offset = (count > 1 ? Rnd() * PIO16 * (count-1) : 0),
                h = heading + offset - (PIO32 * (count-1)),
                v = vector.nrotate(offset - (PIO32 * (count-1))).scale(1 + Rnd() * 0.1 - 0.05);
            v.add(this.player.vector);
            
            bullets.push(new Arena.Bullet(this.player.position.clone(), v, h));
         }
         return bullets;
      }
   });
})();


/**
 * Player Bullet actor class.
 *
 * @namespace Arena
 * @class Arena.Bullet
 */
(function()
{
   Arena.Bullet = function(p, v, h)
   {
      Arena.Bullet.superclass.constructor.call(this, p, v, this.BULLET_LIFESPAN);
      this.heading = h;
      this.radius = this.BULLET_RADIUS;
      return this;
   };
   
   extend(Arena.Bullet, Game.EffectActor,
   {
      BULLET_RADIUS: 12,
      BULLET_LIFESPAN: 750,
      FADE_LENGTH: 125,
      
      /**
       * Bullet heading
       */
      heading: 0,
      
      /**
       * Bullet power energy
       */
      powerLevel: 1,
      
      /**
       * Bullet rendering method
       * 
       * @param ctx {object} Canvas rendering context
       * @param world {object} World metadata
       */
      onRender: function onRender(ctx, world)
      {
         ctx.save();
         if (this.worldToScreen(ctx, world, this.BULLET_RADIUS) &&
             GameHandler.frameStart - this.effectStart > 35)   // hack - to stop draw over player ship
         {
            ctx.globalAlpha = this.effectValue(1.0, this.FADE_LENGTH);
            
            // rotate into the correct heading
            ctx.rotate(this.heading * RAD);
            
            // draw bullet primary weapon
            ctx.drawImage(GameHandler.bitmaps.images["playerweapon"][0], -20, -20);
         }
         ctx.restore();
      },
      
      power: function power()
      {
         return this.powerLevel;
      }
   });
})();


/**
 * Enemy Bullet actor class.
 *
 * @namespace Arena
 * @class Arena.EnemyBullet
 */
(function()
{
   Arena.EnemyBullet = function(p, v, power)
   {
      Arena.EnemyBullet.superclass.constructor.call(this, p, v, this.BULLET_LIFESPAN);
      this.powerLevel = this.playerDamage = power;
      this.radius = this.BULLET_RADIUS;
      return this;
   };
   
   extend(Arena.EnemyBullet, Game.EffectActor,
   {
      BULLET_LIFESPAN: 1250,
      BULLET_RADIUS: 10,
      FADE_LENGTH: 200,
      powerLevel: 0,
      playerDamage: 0,
      
      /**
       * Bullet rendering method
       * 
       * @param ctx {object} Canvas rendering context
       * @param world {object} World metadata
       */
      onRender: function onRender(ctx, world)
      {
         ctx.save();
         // TODO: double up + shadow in prerender phase to avoid "lighter" here...
         ctx.globalCompositeOperation = "lighter";
         if (this.worldToScreen(ctx, world, this.BULLET_RADIUS) &&
             GameHandler.frameStart - this.effectStart > 25)   // hack - to stop draw over enemy
         {
            ctx.globalAlpha = this.effectValue(1.0, this.FADE_LENGTH);
            
            // TODO: prerender this! (with shadow...)
            ctx.fillStyle = Arena.Colours.BULLET_ENEMY;
            
            var rad = this.BULLET_RADIUS - 2;
            ctx.beginPath();
            ctx.arc(0, 0, (rad-1 > 0 ? rad-1 : 0.1), 0, TWOPI, true);
            ctx.closePath();
            ctx.fill();
            
            ctx.rotate((GameHandler.frameCount % 1800) / 5);
            ctx.beginPath()
            ctx.moveTo(rad * 2, 0);
            for (var i=0; i<7; i++)
            {
               ctx.rotate(PIO4);
               if (i%2 === 0)
               {
                  ctx.lineTo((rad * 2 / 0.5) * 0.2, 0);
               }
               else
               {
                  ctx.lineTo(rad * 2, 0);
               }
            }
            ctx.closePath();
            ctx.fill();
         }
         ctx.restore();
      },
      
      power: function power()
      {
         return this.powerLevel;
      }
   });
})();
