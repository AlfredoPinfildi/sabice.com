//import Stats from "stats.js";
export default class Raf {
  constructor() {
    /*this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);*/

    this.callbacks = [];
  }

  requestAnimationFrameCallback = (timestamp) => {
    /*this.stats.begin();

    this.stats.end();*/

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
