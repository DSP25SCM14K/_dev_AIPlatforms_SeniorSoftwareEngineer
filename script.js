document.documentElement.classList.add("js-ready");

const phrases = [
  "secure agentic AI services",
  "workflow automation that removes toil",
  "fast APIs over tuned data paths",
  "observability for AI systems in production",
  "platform foundations teams can trust"
];

const dynamicText = document.querySelector("#dynamic-text");
let phraseIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeLoop() {
  const phrase = phrases[phraseIndex];
  if (!dynamicText) return;

  dynamicText.textContent = phrase.slice(0, characterIndex);

  if (!deleting && characterIndex < phrase.length) {
    characterIndex += 1;
    window.setTimeout(typeLoop, 54);
    return;
  }

  if (!deleting && characterIndex === phrase.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1450);
    return;
  }

  if (deleting && characterIndex > 0) {
    characterIndex -= 1;
    window.setTimeout(typeLoop, 26);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  window.setTimeout(typeLoop, 280);
}

typeLoop();

const header = document.querySelector("[data-header]");
window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 14);
});

const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

reveals.forEach((element) => revealObserver.observe(element));

const metricValues = document.querySelectorAll("[data-count]");
const metricObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateNumber(entry.target);
      metricObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

metricValues.forEach((element) => metricObserver.observe(element));

function animateNumber(element) {
  const target = Number.parseFloat(element.dataset.count || "0");
  const decimals = Number.isInteger(target) ? 0 : 2;
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    element.textContent = current.toLocaleString(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: target === 99.99 ? 2 : 0
    });

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = target.toLocaleString(undefined, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: target === 99.99 ? 2 : 0
      });
    }
  }

  requestAnimationFrame(tick);
}

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const canvas = document.querySelector("#signal-canvas");
const ctx = canvas?.getContext("2d");
let width = 0;
let height = 0;
let points = [];
let rafId = 0;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  points = createPoints(Math.max(34, Math.floor(width / 42)));
}

function createPoints(count) {
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    pulse: Math.random() * Math.PI * 2,
    hue: index % 3
  }));
}

function drawCanvas() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  points.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;
    point.pulse += 0.014;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 150) {
        const alpha = (1 - distance / 150) * 0.18;
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  points.forEach((point) => {
    const radius = 1.2 + Math.sin(point.pulse) * 0.55;
    const color =
      point.hue === 0
        ? "45, 212, 191"
        : point.hue === 1
          ? "56, 189, 248"
          : "245, 158, 11";
    ctx.fillStyle = `rgba(${color}, 0.58)`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(0.8, radius), 0, Math.PI * 2);
    ctx.fill();
  });

  rafId = requestAnimationFrame(drawCanvas);
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function startCanvas() {
  if (!canvas || !ctx || reducedMotion.matches) return;
  cancelAnimationFrame(rafId);
  resizeCanvas();
  drawCanvas();
}

window.addEventListener("resize", resizeCanvas);
startCanvas();
