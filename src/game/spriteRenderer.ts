// Canvas 2D Sprite Renderer for Aawaaz Run
// Renders stylized cute chibi runner avatars (no personal face), cute Doge companion,
// multiple scenic environments (Levels), obstacles, and collectibles.

export type LevelTheme = 'twilight' | 'sunset' | 'bamboo';
export type CharacterSkin = 'wanderer' | 'shiba_hoodie' | 'zen_cloud';

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number;
  isGrounded: boolean;
  isJumping: boolean;
  isSliding: boolean;
  slideTimer: number;
  runFrame: number;
  skin: CharacterSkin;
}

export interface DogeCompanion {
  x: number;
  y: number;
  stride: number;
  tailWag: number;
  isHappy: boolean;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'stone' | 'bush' | 'lantern' | 'wisteria' | 'bamboo_sprout';
  cleared?: boolean;
}

export interface Collectible {
  x: number;
  y: number;
  radius: number;
  type: 'petal' | 'star' | 'coin';
  rotation: number;
  collected?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
  life: number;
}

export class SpriteRenderer {
  constructor() {
    // 100% procedural vector sprite rendering on Canvas - no external image dependencies
  }

  // Draw multi-layer parallax background based on selected Level theme
  public drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    isRainEnabled: boolean,
    rainDrops: { x: number; y: number; speed: number; len: number }[],
    time: number,
    level: LevelTheme = 'twilight'
  ) {
    if (level === 'sunset') {
      this.drawSunsetLevel(ctx, width, height, scrollOffset, time);
    } else if (level === 'bamboo') {
      this.drawBambooLevel(ctx, width, height, scrollOffset, time);
    } else {
      this.drawTwilightLevel(ctx, width, height, scrollOffset, time);
    }

    // Floating Fireflies / Ambient Sparkles
    ctx.save();
    const particleCount = level === 'bamboo' ? 20 : 14;
    for (let i = 0; i < particleCount; i++) {
      const fx = (i * 97 + Math.sin(time * 0.002 + i) * 35) % width;
      const fy = height * 0.45 + (Math.cos(time * 0.003 + i * 2) * 40) + ((i % 5) * 20);
      const glow = (Math.sin(time * 0.005 + i) + 1) * 0.5;

      const pColor =
        level === 'bamboo'
          ? `rgba(167, 243, 208, ${0.3 + glow * 0.6})`
          : level === 'sunset'
          ? `rgba(254, 215, 170, ${0.3 + glow * 0.6})`
          : `rgba(234, 229, 245, ${0.3 + glow * 0.6})`;

      ctx.fillStyle = pColor;
      ctx.beginPath();
      ctx.arc(fx, fy, 2 + glow * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Calming Rain Ambience (if toggled on)
    if (isRainEnabled && rainDrops.length > 0) {
      ctx.save();
      ctx.strokeStyle = level === 'sunset' ? 'rgba(254, 215, 170, 0.4)' : 'rgba(234, 229, 245, 0.45)';
      ctx.lineWidth = 1.3;
      for (const drop of rainDrops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 3.5, drop.y + drop.len);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Ground Track (Zen garden pathway)
    this.drawGroundPathway(ctx, width, height, scrollOffset, level);
  }

  // Level 1: Twilight Lotus Garden (Default)
  private drawTwilightLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    time: number
  ) {
    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#17243A'); // Midnight Navy
    skyGrad.addColorStop(0.35, '#2D3B55');
    skyGrad.addColorStop(0.7, '#5B6F8E');
    skyGrad.addColorStop(1, '#D8D1EC'); // Soft lavender horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Moon
    ctx.save();
    const moonX = width * 0.82;
    const moonY = height * 0.22;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 70);
    moonGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    moonGlow.addColorStop(0.4, 'rgba(234, 229, 245, 0.45)');
    moonGlow.addColorStop(1, 'rgba(234, 229, 245, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFDF7';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Far Misty Mountains
    ctx.save();
    ctx.fillStyle = 'rgba(74, 88, 122, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const mtnOffset = (scrollOffset * 0.08) % width;
    for (let x = -width; x < width * 2; x += 120) {
      const peakY = height * 0.52 + Math.sin((x + mtnOffset) * 0.007) * 45;
      ctx.lineTo(x - mtnOffset, peakY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Mid-ground Pagodas & Pine trees
    ctx.save();
    ctx.fillStyle = 'rgba(35, 48, 70, 0.75)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const hillOffset = (scrollOffset * 0.22) % width;
    for (let x = -width; x < width * 2; x += 80) {
      const hillY = height * 0.64 + Math.sin((x + hillOffset) * 0.012) * 28;
      ctx.lineTo(x - hillOffset, hillY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Silhouettes
    for (let i = 0; i < 6; i++) {
      const tx = ((i * 280 - hillOffset) % (width + 200)) + 50;
      const ty = height * 0.63;
      ctx.fillStyle = 'rgba(23, 36, 58, 0.85)';
      ctx.beginPath();
      ctx.moveTo(tx, ty - 26);
      ctx.lineTo(tx - 12, ty);
      ctx.lineTo(tx + 12, ty);
      ctx.fill();
    }
    ctx.restore();
  }

  // Level 2: Sunset Sakura Valley
  private drawSunsetLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    time: number
  ) {
    // Warm golden peach sunset sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#582C4D'); // Deep sunset violet
    skyGrad.addColorStop(0.35, '#9D4468'); // Rose crimson
    skyGrad.addColorStop(0.7, '#E07A5F'); // Warm terracotta peach
    skyGrad.addColorStop(1, '#F4A261'); // Amber gold horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Warm Golden Sun
    ctx.save();
    const sunX = width * 0.78;
    const sunY = height * 0.3;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 80);
    sunGlow.addColorStop(0, 'rgba(255, 238, 187, 0.95)');
    sunGlow.addColorStop(0.5, 'rgba(244, 162, 97, 0.5)');
    sunGlow.addColorStop(1, 'rgba(244, 162, 97, 0)');
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF6D6';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Far mountains in dusky plum
    ctx.save();
    ctx.fillStyle = 'rgba(107, 47, 78, 0.55)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const mtnOffset = (scrollOffset * 0.08) % width;
    for (let x = -width; x < width * 2; x += 110) {
      const peakY = height * 0.54 + Math.sin((x + mtnOffset) * 0.008) * 40;
      ctx.lineTo(x - mtnOffset, peakY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Mid hills with cherry blossom canopy silhouettes
    ctx.save();
    ctx.fillStyle = 'rgba(64, 25, 48, 0.75)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const hillOffset = (scrollOffset * 0.22) % width;
    for (let x = -width; x < width * 2; x += 80) {
      const hillY = height * 0.65 + Math.sin((x + hillOffset) * 0.013) * 26;
      ctx.lineTo(x - hillOffset, hillY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Drifting Sakura petals in the warm sunset breeze
    ctx.fillStyle = '#FFB7B2';
    for (let i = 0; i < 16; i++) {
      const px = ((i * 110 - scrollOffset * 0.8) % (width + 60)) + 30;
      const py = height * 0.35 + Math.sin(time * 0.003 + i) * 35 + ((i % 4) * 30);
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 7, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Level 3: Midnight Bamboo Sanctuary
  private drawBambooLevel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    time: number
  ) {
    // Deep emerald & indigo night
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#0F1E1E'); // Deep forest noir
    skyGrad.addColorStop(0.4, '#173432');
    skyGrad.addColorStop(0.75, '#234E48');
    skyGrad.addColorStop(1, '#A7D7C5'); // Mint mist horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Pale Jade Moon
    ctx.save();
    const moonX = width * 0.8;
    const moonY = height * 0.24;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 65);
    moonGlow.addColorStop(0, 'rgba(230, 255, 245, 0.9)');
    moonGlow.addColorStop(0.5, 'rgba(167, 243, 208, 0.35)');
    moonGlow.addColorStop(1, 'rgba(167, 243, 208, 0)');
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#F0FDF4';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Silhouettes of Tall Bamboo Stalks in parallax
    ctx.save();
    const stalkOffset = (scrollOffset * 0.16) % width;
    ctx.fillStyle = 'rgba(18, 45, 40, 0.6)';
    for (let x = -width; x < width * 2; x += 55) {
      const bx = x - stalkOffset;
      ctx.fillRect(bx, height * 0.25, 7, height * 0.55);
      // Segment rings
      ctx.fillStyle = 'rgba(12, 30, 28, 0.8)';
      ctx.fillRect(bx - 2, height * 0.38, 11, 3);
      ctx.fillRect(bx - 2, height * 0.52, 11, 3);
      ctx.fillRect(bx - 2, height * 0.65, 11, 3);
      ctx.fillStyle = 'rgba(18, 45, 40, 0.6)';
    }
    ctx.restore();
  }

  // Draw Ground Path with cobblestones and grass
  private drawGroundPathway(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    level: LevelTheme
  ) {
    const groundY = height * 0.76;
    ctx.save();

    // Grass verge
    const grassGrad = ctx.createLinearGradient(0, groundY, 0, height);
    if (level === 'sunset') {
      grassGrad.addColorStop(0, '#8E5A47');
      grassGrad.addColorStop(0.3, '#5C382A');
      grassGrad.addColorStop(1, '#2D1B13');
    } else if (level === 'bamboo') {
      grassGrad.addColorStop(0, '#2D6A5D');
      grassGrad.addColorStop(0.3, '#1E463E');
      grassGrad.addColorStop(1, '#0F2621');
    } else {
      grassGrad.addColorStop(0, '#5B8F8A'); // Teal
      grassGrad.addColorStop(0.3, '#3A605C');
      grassGrad.addColorStop(1, '#17243A');
    }
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, groundY, width, height - groundY);

    // Stone pathway strip
    const pathGrad = ctx.createLinearGradient(0, groundY + 4, 0, groundY + 32);
    if (level === 'sunset') {
      pathGrad.addColorStop(0, '#F5E6D3');
      pathGrad.addColorStop(1, '#D9C1A5');
    } else {
      pathGrad.addColorStop(0, '#EAE6E1');
      pathGrad.addColorStop(1, '#C8C2BA');
    }
    ctx.fillStyle = pathGrad;
    ctx.fillRect(0, groundY + 8, width, 24);

    // Animated cobblestone lines
    const stoneOffset = (scrollOffset * 1.0) % 60;
    ctx.strokeStyle = 'rgba(23, 36, 58, 0.22)';
    ctx.lineWidth = 2;
    for (let x = -60; x < width + 60; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x - stoneOffset, groundY + 8);
      ctx.lineTo(x - stoneOffset - 6, groundY + 32);
      ctx.stroke();
    }

    // Grass blades on path edge
    ctx.fillStyle = level === 'bamboo' ? '#3B8272' : '#6BA39E';
    for (let x = -20; x < width + 20; x += 18) {
      const bladeOffset = (scrollOffset * 1.0) % 18;
      const bx = x - bladeOffset;
      ctx.beginPath();
      ctx.moveTo(bx, groundY + 4);
      ctx.lineTo(bx + 3, groundY - 4);
      ctx.lineTo(bx + 6, groundY + 4);
      ctx.fill();
    }
    ctx.restore();
  }

  // Draw Cute Stylized Chibi Runner Avatar (NO personal face photos!)
  public drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: PlayerState,
    groundY: number
  ) {
    ctx.save();

    const cx = player.x + player.width / 2;

    // 1. Shadow underneath
    const shadowY = groundY + 12;
    const heightAboveGround = Math.max(0, groundY - (player.y + player.height));
    const shadowScale = Math.max(0.3, 1 - heightAboveGround / 180);
    ctx.fillStyle = 'rgba(23, 36, 58, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx, shadowY, (player.width / 2) * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sliding State (Instant, clear low crouch pose with speed lines)
    if (player.isSliding) {
      this.drawChibiSliding(ctx, player, cx);
      ctx.restore();
      return;
    }

    // 3. Normal / Jumping Runner Character
    const stride = Math.sin(player.runFrame * 0.4);
    const bounce = player.isGrounded ? Math.abs(Math.sin(player.runFrame * 0.4)) * 4.5 : 0;
    const currentY = player.y - bounce;

    // Running Legs
    const hipX = cx;
    const hipY = currentY + player.height * 0.62;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = player.skin === 'shiba_hoodie' ? '#78350F' : '#17243A';

    if (player.isGrounded) {
      // Back Leg
      const leg1X = hipX + stride * 14;
      const leg1Y = hipY + 22 - Math.abs(stride) * 6;
      ctx.beginPath();
      ctx.moveTo(hipX - 3, hipY);
      ctx.lineTo(leg1X, leg1Y);
      ctx.stroke();

      // Front Leg
      const leg2X = hipX - stride * 14;
      const leg2Y = hipY + 22 - (1 - Math.abs(stride)) * 4;
      ctx.beginPath();
      ctx.moveTo(hipX + 3, hipY);
      ctx.lineTo(leg2X, leg2Y);
      ctx.stroke();

      // Cute Runner Shoes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(leg1X + 2, leg1Y + 2, 6, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(leg2X + 2, leg2Y + 2, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Jump Pose: Legs tucked forward
      ctx.beginPath();
      ctx.moveTo(hipX - 3, hipY);
      ctx.lineTo(hipX - 10, hipY + 14);
      ctx.lineTo(hipX - 2, hipY + 22);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hipX + 3, hipY);
      ctx.lineTo(hipX + 8, hipY + 12);
      ctx.lineTo(hipX + 16, hipY + 18);
      ctx.stroke();

      // Shoes
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(hipX - 2, hipY + 23, 6, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(hipX + 16, hipY + 19, 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Torso / Outfit based on skin
    const torsoTopY = currentY + player.height * 0.32;
    if (player.skin === 'shiba_hoodie') {
      // Warm Amber Shiba Hoodie
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.roundRect(cx - 13, torsoTopY, 26, hipY - torsoTopY + 2, 6);
      ctx.fill();

      // White cozy pocket
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.roundRect(cx - 7, hipY - 10, 14, 8, 3);
      ctx.fill();
    } else if (player.skin === 'zen_cloud') {
      // Lavender Cloud Robe
      ctx.fillStyle = '#8B5CF6';
      ctx.beginPath();
      ctx.roundRect(cx - 13, torsoTopY, 26, hipY - torsoTopY + 2, 6);
      ctx.fill();

      // White sash
      ctx.fillStyle = '#EDE9FE';
      ctx.fillRect(cx - 13, hipY - 6, 26, 4);
    } else {
      // Lotus Wanderer (Default): Navy Windbreaker & Crisp White Shirt
      ctx.fillStyle = '#17243A';
      ctx.beginPath();
      ctx.roundRect(cx - 12, torsoTopY, 24, hipY - torsoTopY + 2, 5);
      ctx.fill();

      // White athletic V-collar
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(cx - 5, torsoTopY);
      ctx.lineTo(cx, torsoTopY + 9);
      ctx.lineTo(cx + 5, torsoTopY);
      ctx.closePath();
      ctx.fill();

      // Muted teal sporty accent stripe
      ctx.strokeStyle = '#5B8F8A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 10, torsoTopY + 14);
      ctx.lineTo(cx + 10, torsoTopY + 14);
      ctx.stroke();
    }

    // Trailing Scarf / Ribbon in the wind
    ctx.save();
    ctx.strokeStyle = player.skin === 'shiba_hoodie' ? '#D97706' : '#5B8F8A';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    const scarfWave = Math.sin(player.runFrame * 0.5) * 4;
    ctx.beginPath();
    ctx.moveTo(cx - 6, torsoTopY + 4);
    ctx.quadraticCurveTo(cx - 18, torsoTopY + 6 + scarfWave, cx - 28, torsoTopY + 2 - scarfWave);
    ctx.stroke();
    ctx.restore();

    // Arms
    ctx.lineWidth = 5;
    ctx.strokeStyle = player.skin === 'shiba_hoodie' ? '#F59E0B' : '#17243A';
    const shoulderY = torsoTopY + 4;
    const armSwing = player.isGrounded ? -stride * 12 : -10;

    // Back arm
    ctx.beginPath();
    ctx.moveTo(cx - 10, shoulderY);
    ctx.lineTo(cx - 18 - armSwing, shoulderY + 12);
    ctx.stroke();

    // Front arm
    ctx.beginPath();
    ctx.moveTo(cx + 10, shoulderY);
    ctx.lineTo(cx + 18 + armSwing, shoulderY + 12);
    ctx.stroke();

    // Stylized Anime Chibi Head (Cute, expressive, completely illustrated)
    const headRadius = 17;
    const headX = cx;
    const headY = torsoTopY - headRadius + 3;

    // Face Skin
    ctx.fillStyle = '#FDE68A'; // Warm anime skin tone
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Soft blush cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.5)';
    ctx.beginPath();
    ctx.arc(headX - 8, headY + 5, 3.5, 0, Math.PI * 2);
    ctx.arc(headX + 8, headY + 5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Cute Anime Eyes (Facing forward / right)
    ctx.fillStyle = '#17243A';
    ctx.beginPath();
    // Left eye
    ctx.ellipse(headX - 4, headY, 2.8, 4.2, 0, 0, Math.PI * 2);
    // Right eye
    ctx.ellipse(headX + 5, headY, 2.8, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye sparkles
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(headX - 3.2, headY - 1.5, 1.2, 0, Math.PI * 2);
    ctx.arc(headX + 5.8, headY - 1.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Cute smile
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(headX + 1, headY + 5, 3, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Hair & Headwear based on skin
    if (player.skin === 'shiba_hoodie') {
      // Cute Shiba Doge Ears on Hoodie
      ctx.fillStyle = '#F59E0B';
      // Left ear
      ctx.beginPath();
      ctx.moveTo(headX - 12, headY - 12);
      ctx.lineTo(headX - 18, headY - 24);
      ctx.lineTo(headX - 4, headY - 16);
      ctx.fill();
      // Right ear
      ctx.beginPath();
      ctx.moveTo(headX + 4, headY - 16);
      ctx.lineTo(headX + 16, headY - 24);
      ctx.lineTo(headX + 12, headY - 12);
      ctx.fill();

      // Pink inner ears
      ctx.fillStyle = '#FECDD3';
      ctx.beginPath();
      ctx.moveTo(headX - 12, headY - 13);
      ctx.lineTo(headX - 16, headY - 21);
      ctx.lineTo(headX - 6, headY - 16);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(headX + 6, headY - 16);
      ctx.lineTo(headX + 14, headY - 21);
      ctx.lineTo(headX + 11, headY - 13);
      ctx.fill();
    } else {
      // Stylized Windswept Hair with Athletic Headband
      ctx.fillStyle = '#1E293B'; // Dark sleek anime hair
      ctx.beginPath();
      ctx.arc(headX, headY - 5, headRadius + 1, Math.PI, Math.PI * 2);
      ctx.lineTo(headX + headRadius + 2, headY);
      ctx.lineTo(headX + headRadius - 4, headY + 6);
      ctx.lineTo(headX + 8, headY - 2);
      ctx.lineTo(headX, headY - 4);
      ctx.lineTo(headX - 8, headY - 2);
      ctx.lineTo(headX - headRadius + 4, headY + 6);
      ctx.lineTo(headX - headRadius - 2, headY);
      ctx.closePath();
      ctx.fill();

      // Sporty Teal Headband
      ctx.fillStyle = '#5B8F8A';
      ctx.beginPath();
      ctx.roundRect(headX - headRadius - 1, headY - 9, (headRadius + 1) * 2, 5, 2);
      ctx.fill();

      // Lotus emblem in center of headband
      ctx.fillStyle = '#EAE5F5';
      ctx.beginPath();
      ctx.arc(headX, headY - 6.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw sliding crouched posture (Instant, smooth, clean hitbox!)
  private drawChibiSliding(
    ctx: CanvasRenderingContext2D,
    player: PlayerState,
    cx: number
  ) {
    const cy = player.y + player.height / 2 + 6;

    // Slide dust & spark trail along ground
    ctx.fillStyle = 'rgba(234, 229, 245, 0.7)';
    ctx.beginPath();
    ctx.arc(player.x - 8, player.y + player.height - 2, 6, 0, Math.PI * 2);
    ctx.arc(player.x - 18, player.y + player.height - 4, 4.5, 0, Math.PI * 2);
    ctx.arc(player.x - 28, player.y + player.height - 3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Speed lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(player.x - 12, player.y + 10);
    ctx.lineTo(player.x - 30, player.y + 10);
    ctx.moveTo(player.x - 8, player.y + 20);
    ctx.lineTo(player.x - 24, player.y + 20);
    ctx.stroke();

    // Low Horizontal Sliding Body
    ctx.save();
    ctx.translate(cx, cy);

    // Legs stretched forward
    ctx.lineWidth = 7;
    ctx.strokeStyle = player.skin === 'shiba_hoodie' ? '#78350F' : '#17243A';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-14, 6);
    ctx.lineTo(26, 8);
    ctx.stroke();

    // White sliding shoe
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(28, 8, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tilted Low Torso
    ctx.fillStyle = player.skin === 'shiba_hoodie' ? '#F59E0B' : '#17243A';
    ctx.beginPath();
    ctx.roundRect(-20, -5, 28, 14, 4);
    ctx.fill();

    // Trailing scarf
    ctx.strokeStyle = '#5B8F8A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-18, -2);
    ctx.lineTo(-34, -6);
    ctx.stroke();

    // Chibi Head (Lowered, leaning forward)
    const headRadius = 14;
    const hx = -10;
    const hy = -8;

    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(hx, hy, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Focused eye looking ahead
    ctx.fillStyle = '#17243A';
    ctx.beginPath();
    ctx.ellipse(hx + 5, hy, 2.5, 3.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(hx + 6, hy - 1, 1, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.arc(hx, hy - 4, headRadius, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw cute friendly Doge companion chasing happily behind
  public drawDoge(
    ctx: CanvasRenderingContext2D,
    doge: DogeCompanion,
    groundY: number,
    time: number
  ) {
    ctx.save();

    const dx = doge.x;
    const dy = doge.y;

    // Shadow
    ctx.fillStyle = 'rgba(23, 36, 58, 0.2)';
    ctx.beginPath();
    ctx.ellipse(dx + 16, groundY + 10, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bounce = Math.abs(Math.sin(doge.stride)) * 4.5;
    const dogeY = dy - bounce;

    // Fluffy curly tail wagging happily (fast wag)
    const wag = Math.sin(time * 0.02) * 0.35;
    ctx.save();
    ctx.translate(dx - 4, dogeY + 12);
    ctx.rotate(-0.5 + wag);
    ctx.fillStyle = '#E5A65D'; // Shiba gold
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFF5E4'; // White fluffy tip
    ctx.beginPath();
    ctx.arc(2, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Doge Body (Chubby golden loaf)
    ctx.fillStyle = '#E5A65D';
    ctx.beginPath();
    ctx.ellipse(dx + 14, dogeY + 16, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // White belly fur
    ctx.fillStyle = '#FFF5E4';
    ctx.beginPath();
    ctx.ellipse(dx + 16, dogeY + 19, 13, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trotting paws
    const pawStride = Math.sin(doge.stride);
    ctx.fillStyle = '#FFF5E4';
    ctx.beginPath();
    ctx.roundRect(dx + 4 + pawStride * 6, dogeY + 24, 6, 9, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(dx + 10 - pawStride * 6, dogeY + 24, 6, 9, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(dx + 22 - pawStride * 6, dogeY + 24, 6, 9, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(dx + 28 + pawStride * 6, dogeY + 24, 6, 9, 3);
    ctx.fill();

    // Doge Head
    const headX = dx + 30;
    const headY = dogeY + 10;
    ctx.fillStyle = '#E5A65D';
    ctx.beginPath();
    ctx.arc(headX, headY, 13, 0, Math.PI * 2);
    ctx.fill();

    // White cheeks & muzzle
    ctx.fillStyle = '#FFF5E4';
    ctx.beginPath();
    ctx.ellipse(headX + 4, headY + 3, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shiba Ears
    ctx.fillStyle = '#E5A65D';
    ctx.beginPath();
    ctx.moveTo(headX - 6, headY - 8);
    ctx.lineTo(headX - 10, headY - 19);
    ctx.lineTo(headX - 1, headY - 11);
    ctx.fill();
    ctx.fillStyle = '#FFAAAA';
    ctx.beginPath();
    ctx.moveTo(headX - 6, headY - 9);
    ctx.lineTo(headX - 9, headY - 17);
    ctx.lineTo(headX - 2, headY - 12);
    ctx.fill();

    ctx.fillStyle = '#E5A65D';
    ctx.beginPath();
    ctx.moveTo(headX + 1, headY - 10);
    ctx.lineTo(headX + 6, headY - 20);
    ctx.lineTo(headX + 9, headY - 8);
    ctx.fill();
    ctx.fillStyle = '#FFAAAA';
    ctx.beginPath();
    ctx.moveTo(headX + 2, headY - 10);
    ctx.lineTo(headX + 6, headY - 18);
    ctx.lineTo(headX + 8, headY - 9);
    ctx.fill();

    // Friendly Sparkle Eye
    ctx.fillStyle = '#251E18';
    ctx.beginPath();
    ctx.arc(headX + 4, headY - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(headX + 4.8, headY - 2.8, 1, 0, Math.PI * 2);
    ctx.fill();

    // Cute Nose
    ctx.fillStyle = '#17243A';
    ctx.beginPath();
    ctx.arc(headX + 11, headY + 1.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Happy tongue
    ctx.fillStyle = '#FF7B8E';
    ctx.beginPath();
    ctx.ellipse(headX + 10, headY + 6, 3, 4, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Floating love heart
    const heartFloat = (Math.sin(time * 0.005) + 1) * 4;
    ctx.fillStyle = 'rgba(255, 120, 150, 0.8)';
    ctx.beginPath();
    const hx = headX - 6;
    const hy = headY - 22 - heartFloat;
    ctx.arc(hx - 2, hy, 3, Math.PI, 0);
    ctx.arc(hx + 2, hy, 3, Math.PI, 0);
    ctx.lineTo(hx, hy + 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Draw obstacles (Ground obstacles & Overhead obstacles that need sliding)
  public drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle) {
    ctx.save();

    if (obs.type === 'stone') {
      // Zen River Stone
      ctx.fillStyle = 'rgba(23, 36, 58, 0.2)';
      ctx.beginPath();
      ctx.ellipse(obs.x + obs.width / 2, obs.y + obs.height, obs.width / 2 + 4, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const stoneGrad = ctx.createLinearGradient(obs.x, obs.y, obs.x + obs.width, obs.y + obs.height);
      stoneGrad.addColorStop(0, '#B3B8C4');
      stoneGrad.addColorStop(0.6, '#8E94A2');
      stoneGrad.addColorStop(1, '#666C7A');
      ctx.fillStyle = stoneGrad;
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.width, obs.height, [16, 16, 8, 8]);
      ctx.fill();

      // Moss patch
      ctx.fillStyle = '#5B8F8A';
      ctx.beginPath();
      ctx.ellipse(obs.x + obs.width * 0.45, obs.y + 4, obs.width * 0.35, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'bush') {
      // Blooming Lotus Bush
      ctx.fillStyle = '#48756F';
      ctx.beginPath();
      ctx.arc(obs.x + 12, obs.y + 14, 12, 0, Math.PI * 2);
      ctx.arc(obs.x + obs.width - 12, obs.y + 14, 12, 0, Math.PI * 2);
      ctx.arc(obs.x + obs.width / 2, obs.y + 10, 14, 0, Math.PI * 2);
      ctx.fill();

      // Pink blossoms
      ctx.fillStyle = '#FFAAAA';
      ctx.beginPath();
      ctx.arc(obs.x + obs.width / 2, obs.y + 8, 4, 0, Math.PI * 2);
      ctx.arc(obs.x + 10, obs.y + 14, 3, 0, Math.PI * 2);
      ctx.arc(obs.x + obs.width - 10, obs.y + 14, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'bamboo_sprout') {
      // Springing Bamboo Stalk
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.roundRect(obs.x + 8, obs.y, 16, obs.height, 4);
      ctx.fill();
      ctx.fillStyle = '#059669';
      ctx.fillRect(obs.x + 6, obs.y + 12, 20, 3);
      // Leaves
      ctx.beginPath();
      ctx.ellipse(obs.x + 24, obs.y + 6, 8, 3, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'lantern') {
      // OVERHEAD LANTERN (SLIDE UNDER)
      ctx.strokeStyle = '#5B8F8A';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.width / 2, 0);
      ctx.lineTo(obs.x + obs.width / 2, obs.y);
      ctx.stroke();

      // Lantern glow
      const glow = ctx.createRadialGradient(
        obs.x + obs.width / 2,
        obs.y + obs.height / 2,
        4,
        obs.x + obs.width / 2,
        obs.y + obs.height / 2,
        obs.width
      );
      glow.addColorStop(0, 'rgba(255, 230, 160, 0.95)');
      glow.addColorStop(0.5, 'rgba(234, 160, 180, 0.6)');
      glow.addColorStop(1, 'rgba(234, 160, 180, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(obs.x + obs.width / 2, obs.y + obs.height / 2, obs.width, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = '#FFF8E8';
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 6);
      ctx.fill();
      ctx.strokeStyle = '#D4A373';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tassel
      ctx.strokeStyle = '#FF7B8E';
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.width / 2, obs.y + obs.height);
      ctx.lineTo(obs.x + obs.width / 2, obs.y + obs.height + 8);
      ctx.stroke();
    } else if (obs.type === 'wisteria') {
      // OVERHEAD WISTERIA BLOSSOM VINE (SLIDE UNDER)
      ctx.strokeStyle = '#4A3B32';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(obs.x - 10, obs.y);
      ctx.quadraticCurveTo(obs.x + obs.width / 2, obs.y + 6, obs.x + obs.width + 10, obs.y);
      ctx.stroke();

      const clusterColors = ['#9B89B3', '#B8A6CE', '#D6C8E8'];
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = clusterColors[i % clusterColors.length];
        const cx = obs.x + (i * obs.width) / 4;
        const cy = obs.y + 6 + (i % 2) * 5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 5, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Draw collectibles
  public drawCollectible(ctx: CanvasRenderingContext2D, col: Collectible, time: number) {
    ctx.save();
    const cx = col.x;
    const cy = col.y + Math.sin(time * 0.005 + col.x) * 4;

    // Glowing halo
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, col.radius * 2);
    glow.addColorStop(0, 'rgba(255, 235, 170, 0.85)');
    glow.addColorStop(0.6, 'rgba(234, 229, 245, 0.3)');
    glow.addColorStop(1, 'rgba(234, 229, 245, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, col.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    if (col.type === 'petal') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(col.rotation);

      ctx.fillStyle = '#FFE082';
      ctx.beginPath();
      ctx.moveTo(0, -col.radius);
      ctx.quadraticCurveTo(col.radius, 0, 0, col.radius);
      ctx.quadraticCurveTo(-col.radius, 0, 0, -col.radius);
      ctx.fill();

      ctx.strokeStyle = '#FFA726';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -col.radius * 0.7);
      ctx.lineTo(0, col.radius * 0.7);
      ctx.stroke();

      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(col.rotation);

      ctx.fillStyle = '#FFF59D';
      ctx.beginPath();
      const spikes = 5;
      const step = Math.PI / spikes;
      let rot = (Math.PI / 2) * 3;
      for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * col.radius;
        let y = Math.sin(rot) * col.radius;
        ctx.lineTo(x, y);
        rot += step;
        x = Math.cos(rot) * (col.radius * 0.5);
        y = Math.sin(rot) * (col.radius * 0.5);
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  // Draw floating particles
  public drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    ctx.save();
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
