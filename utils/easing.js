const easeInOutQuint = (t) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;

const easeOutQuint = (t) => 1 + --t * t * t * t * t;

const easeInOutCirc = (pos) => {
  if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
  return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
};

export { easeOutQuint, easeInOutQuint, easeInOutCirc };
