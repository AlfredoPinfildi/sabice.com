const clamp = (val, min = 0, max = 1) => Math.max(min, Math.min(max, val));
export default clamp;