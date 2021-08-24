import "./style.css";

import { getRaf } from "@app";

export default class Loader {
  constructor() {
    this.block = document.querySelector(".loader");

    this.transitionDuration = 1600;
    this.progress = 0;
    this.loadCallbacks = [];

    const raf = getRaf();
    raf.register("loader", this.hide);

    const resourcesToLoad = document.querySelectorAll("img[src]:not([src=''])");
    if (resourcesToLoad.length > 0) {
      this.resourcesAmount = resourcesToLoad.length;
      this.resourcesLoaded = 0;

      resourcesToLoad.forEach((r) => {
        let image = new Image();
        image.addEventListener("load", () => {
          this.resourcesLoaded += 1;

          this.progress = this.resourcesLoaded / this.resourcesAmount;
        });
        image.src = r.src;
      });
    } else {
      this.progress = 1;
    }
  }

  subscribe = (callback) => {
    this.loadCallbacks.push(callback);
  };

  animate = () => {
    this.block.style.clipPath = `polygon(${
      100 * this.progress
    }% 0%, 100% 0%, 100% 100%, ${100 * this.progress}% 100%)`;
  };

  hide = () => {
    this.animate();

    if (this.progress === 1) {
      const raf = getRaf();
      raf.unregister("loader");

      this.block.addEventListener("transitionend", () => {
        this.loadCallbacks.forEach((callback, i) => {
          callback();
          this.loadCallbacks.splice(i, 1);
        });
        document.body.classList.add("loaded");
        this.block.style.pointerEvents = "none";
      });
    }
  };
}
