import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { ReactTyped } from 'react-typed';
import { Plus } from 'lucide-react';

// Canvas animation setup
function Node() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
}

function SineWave(e) {
  this.init(e || {});
}

SineWave.prototype = {
  init: function (e) {
    this.phase = e.phase || 0;
    this.offset = e.offset || 0;
    this.frequency = e.frequency || 0.001;
    this.amplitude = e.amplitude || 1;
  },
  update: function () {
    this.phase += this.frequency;
    return (this.value = this.offset + Math.sin(this.phase) * this.amplitude);
  },
  value: function () {
    return this.value;
  },
};

function Line(e) {
  this.init(e || {});
}

Line.prototype = {
  init: function (e) {
    this.spring = e.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (var t, n = 0; n < E.size; n++) {
      t = new Node();
      t.x = pos.x;
      t.y = pos.y;
      this.nodes.push(t);
    }
  },
  update: function () {
    let e = this.spring;
    let t = this.nodes[0];
    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;
    for (var n, i = 0, a = this.nodes.length; i < a; i++) {
      t = this.nodes[i];
      if (0 < i) {
        n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * e;
        t.vy += (n.y - t.y) * e;
        t.vx += n.vx * E.dampening;
        t.vy += n.vy * E.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= E.tension;
    }
  },
  draw: function (ctx) {
    let e, t, n = this.nodes[0].x, i = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(n, i);
    for (var a = 1, o = this.nodes.length - 2; a < o; a++) {
      e = this.nodes[a];
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      ctx.quadraticCurveTo(e.x, e.y, n, i);
    }
    e = this.nodes[a];
    t = this.nodes[a + 1];
    ctx.quadraticCurveTo(e.x, e.y, t.x, t.y);
    ctx.stroke();
    ctx.closePath();
  },
};

let ctx, f, e = 0, pos = {}, lines = [];
const E = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

function onMousemove(e) {
  function c(e) {
    if (e.touches) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
    e.preventDefault();
  }
  
  function l(e) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }
  
  function o() {
    lines = [];
    for (let e = 0; e < E.trails; e++) {
      lines.push(new Line({ spring: 0.45 + (e / E.trails) * 0.025 }));
    }
  }
  
  document.removeEventListener("mousemove", onMousemove);
  document.removeEventListener("touchstart", onMousemove);
  document.addEventListener("mousemove", c);
  document.addEventListener("touchmove", c);
  document.addEventListener("touchstart", l);
  c(e);
  o();
  render();
}

function render() {
  if (ctx && ctx.running) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.025)";
    ctx.lineWidth = 10;
    for (var e, t = 0; t < E.trails; t++) {
      e = lines[t];
      e.update();
      e.draw(ctx);
    }
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas(canvas) {
  if (canvas) {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight;
  }
}

export const renderCanvas = function (canvasId = 'hero-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  ctx = canvas.getContext("2d");
  ctx.running = true;
  ctx.frame = 1;
  f = new SineWave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });
  
  document.addEventListener("mousemove", onMousemove);
  document.addEventListener("touchstart", onMousemove);
  document.body.addEventListener("orientationchange", () => resizeCanvas(canvas));
  window.addEventListener("resize", () => resizeCanvas(canvas));
  window.addEventListener("focus", () => {
    if (ctx && !ctx.running) {
      ctx.running = true;
      render();
    }
  });
  window.addEventListener("blur", () => {
    if (ctx) ctx.running = true;
  });
  resizeCanvas(canvas);
};

export const TypeWriter = ({ strings }) => {
  return (
    <ReactTyped
      loop
      typeSpeed={80}
      backSpeed={20}
      strings={strings}
      smartBackspace
      backDelay={1000}
      loopCount={0}
      showCursor
      cursorChar="|"
    />
  );
};

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}) {
  const colorValue = Array.isArray(color) ? color.join(",") : color;
  
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
      }}
      className={clsx(
        "relative grid h-full w-full place-items-center rounded-3xl bg-white/5 backdrop-blur-md p-3 text-white border border-white/10",
        className,
      )}
    >
      <div
        style={{
          "--border-width": `${borderWidth}px`,
          "--border-radius": `${borderRadius}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${colorValue},transparent,transparent)`,
        }}
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-3xl before:p-[--border-width] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:![mask-composite:exclude] before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_infinite_linear]`}
      ></div>
      {children}
    </div>
  );
}

export function HeroDesignali({
  title = "Your complete platform for the",
  subtitle,
  description,
  typeWriterStrings = ["Products", "Services", "Beauty Spa", "Marketplace"],
  primaryButtonText = "Explore Now",
  primaryButtonAction,
  secondaryButtonText = "Learn More",
  secondaryButtonAction,
  showBadge = false,
  badgeText = "New Collection",
  badgeLink,
  accentColor = "brand-500",
  canvasId = "hero-canvas",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      renderCanvas(canvasId);
    }
    return () => {
      if (ctx) {
        ctx.running = false;
      }
    };
  }, [canvasId]);

  const accentClass = `text-${accentColor}`;

  return (
    <main className="relative overflow-hidden">
      <section id="home" className="relative min-h-[600px] flex items-center justify-center">
        {/* Grid Background */}
        <div className="absolute inset-0 max-md:hidden top-[400px] -z-10 h-[400px] w-full bg-transparent bg-[linear-gradient(to_right,#57534e_1px,transparent_1px),linear-gradient(to_bottom,#57534e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        
        <div className="flex flex-col items-center justify-center px-6 text-center w-full max-w-7xl mx-auto py-20">
          {showBadge && (
            <div className="mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
              <div className="relative flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-3 py-1 text-xs text-white/60">
                {badgeText}
                {badgeLink && (
                  <a
                    href={badgeLink}
                    rel="noreferrer"
                    className="ml-1 flex items-center font-semibold text-white hover:text-brand-400 transition-colors"
                  >
                    Explore <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-5xl w-full">
            <div className="relative mx-auto h-full bg-transparent border border-white/10 py-12 p-6 rounded-3xl [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)]">
              <Plus
                strokeWidth={4}
                className={`${accentClass} absolute -left-5 -top-5 h-10 w-10 opacity-50`}
              />
              <Plus
                strokeWidth={4}
                className={`${accentClass} absolute -bottom-5 -left-5 h-10 w-10 opacity-50`}
              />
              <Plus
                strokeWidth={4}
                className={`${accentClass} absolute -right-5 -top-5 h-10 w-10 opacity-50`}
              />
              <Plus
                strokeWidth={4}
                className={`${accentClass} absolute -bottom-5 -right-5 h-10 w-10 opacity-50`}
              />
              
              <h1 className="flex flex-col text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-none tracking-tight md:flex-col lg:flex-row">
                <span>
                  {title}
                </span>
              </h1>
              
              {subtitle && (
                <h2 className="mt-8 text-xl md:text-2xl text-white/90">
                  {subtitle}
                </h2>
              )}
              
              {description && (
                <p className="text-white/60 py-4 text-base md:text-lg max-w-2xl mx-auto">
                  {description}{" "}
                  {typeWriterStrings && typeWriterStrings.length > 0 && (
                    <span className="text-brand-400 font-semibold">
                      <TypeWriter strings={typeWriterStrings} />
                    </span>
                  )}
                  .
                </p>
              )}
              
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                {primaryButtonText && (
                  <ShineBorder
                    borderWidth={3}
                    className="border cursor-pointer h-auto w-auto p-2 bg-white/5 backdrop-blur-md"
                    color={["#1da0e6", "#3ed598", "#facc15"]}
                  >
                    <button
                      onClick={primaryButtonAction}
                      className="w-full rounded-xl px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors"
                    >
                      {primaryButtonText}
                    </button>
                  </ShineBorder>
                )}
                {secondaryButtonText && (
                  <button
                    onClick={secondaryButtonAction}
                    className="rounded-xl px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors backdrop-blur-md"
                  >
                    {secondaryButtonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <canvas
          ref={canvasRef}
          id={canvasId}
          className="pointer-events-none absolute inset-0 mx-auto -z-10"
        ></canvas>
      </section>
    </main>
  );
}

