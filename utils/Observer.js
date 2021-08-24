export default class Observer {
  constructor() {
    this.listeners = {};
    this.thresholds = [0.2, 0.4, 0.8];

    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback,
      {
        threshold: this.thresholds,
      }
    );
  }

  intersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const threshold = parseFloat(entry.target.dataset.intersectionRatio);
      const intersectionRatio = Math.floor(entry.intersectionRatio * 10) / 10;

      if (
        entry.isIntersecting &&
        ((intersectionRatio >= threshold &&
          intersectionRatio < threshold + 0.8) ||
          entry.intersectionRatio === 1)
      ) {
        const targetInstanceIndex = entry.target.dataset.instanceIndex;
        this.listeners[targetInstanceIndex]();
      }
    });
  };

  register = (istanceIndex, listener, node) => {
    if ("IntersectionObserver" in window) {
      this.listeners[istanceIndex] = listener;
      this.observer.observe(node);
    } else {
      listener();
    }
  };

  unregister = (node) => {
    if ("IntersectionObserver" in window && this.observer) {
      this.observer.unobserve(node);
    }
  };
}
