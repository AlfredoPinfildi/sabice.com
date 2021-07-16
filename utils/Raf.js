export default class Raf {
  constructor() {
    this.callbacks = [];
  }

  requestAnimationFrameCallback = (timestamp) => {
    this.raf = requestAnimationFrame(this.requestAnimationFrameCallback);
    this.callbacks.forEach((callback) => {
      callback.callback(timestamp);
    });
  };

  register = (instanceIndex, callback) => {
    this.callbacks.push({
      instanceIndex,
      callback,
    });

    if (!this.raf) {
      this.raf = requestAnimationFrame(this.requestAnimationFrameCallback);
    }
  };

  unregister = (instanceIndex) => {
    this.callbacks = this.callbacks.filter((callback) => {
      return callback.instanceIndex !== instanceIndex;
    });

    if (this.callbacks.length < 1) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  };
}
