import "./style.css";

import layout from "./layout.html";
import layoutIllustratore from "./layout_illustratore.html";

import { easeInOutCirc } from "@utils/easing.js";
import clamp from "@utils/clamp.js";
import { getInstance } from "@app";
import { listen } from "@router/History.js";

export default class Footer {
  static selector = "footer";

  constructor(block) {
    this.block = block;

    this.block.innerHTML = block.classList.contains("footer--illustratore")
      ? layoutIllustratore
      : layout;

    this.unmountDuration = 800;
    this.unmountStyles = {
      opacity: {
        current: 1,
        ease: easeInOutCirc,
        fromValue: 1,
        toValue: 0,
        setValue: (progress) => {
          return this.unmountStyles.opacity.fromValue * (1 - progress);
        },
      },
    };

    this.mountDuration = 800;
    this.mountStyles = {
      opacity: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue: 1,
        setValue: (progress) => {
          return this.mountStyles.opacity.toValue * progress;
        },
      },
    };
  }

  unmount = (removeFromDom = false) => {
    this.removeFromDom = removeFromDom;
    requestAnimationFrame(this.animateUnmount);
  };

  animateUnmount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = clamp(
      (timestamp - this.animationStartTimestamp) / this.unmountDuration,
      0,
      1
    );
    for (const key in this.unmountStyles) {
      this.unmountStyles[key].current =
        this.unmountStyles[key].setValue(progress);
    }

    this.unmountLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateUnmount);
    } else {
      window.cancelAnimationFrame(this.raf);
      this.animationStartTimestamp = null;
      this.raf = null;
      if (this.removeFromDom) {
        document.body.removeChild(this.block);
      }
    }
  };

  unmountLayout = () => {
    this.block.style.opacity = this.unmountStyles.opacity.current;
  };

  mount = () => {
    requestAnimationFrame(this.animateMount);
  };

  animateMount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = clamp(
      (timestamp - this.animationStartTimestamp) / this.mountDuration,
      0,
      1
    );
    for (const key in this.mountStyles) {
      this.mountStyles[key].current = this.mountStyles[key].setValue(progress);
    }

    this.mountLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateMount);
    } else {
      window.cancelAnimationFrame(this.raf);
      this.raf = null;
      this.animationStartTimestamp = null;
    }
  };

  mountLayout = () => {
    this.block.style.opacity = this.mountStyles.opacity.current;
  };
}
