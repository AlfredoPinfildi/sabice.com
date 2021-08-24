import "./style.css";

import layout from "./layout.html";
import layoutCentered from "./layout_centered.html";
import layoutLavoro from "./layout_lavoro.html";

import { easeInOutCirc } from "@utils/easing.js";
import clamp from "@utils/clamp.js";
import { getInstance } from "@app";
import { listen } from "@router/History.js";

export default class Header {
  static selector = "header";

  constructor(block) {
    this.block = block;

    this.block.innerHTML =
      this.block.classList.contains("header--centered") ||
      this.block.classList.contains("header--illustratore")
        ? layoutCentered
        : this.block.classList.contains("header--lavoro")
        ? layoutLavoro
        : layout;

    listen((previouseRoute, route) => {
      this.previouseRoute = previouseRoute;
    });

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

    this.previouseRoute = "/";
  }

  unmount(removeFromDom = false) {
    this.removeFromDom = removeFromDom;
    requestAnimationFrame(this.animateUnmount);
  }

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
      this.raf = null;
      this.animationStartTimestamp = null;
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

  onLogoEnter = () => {
    const phrasesInstance = getInstance(this.phrases);
    if (
      this.phrases.classList.contains("no-mo-phrases--visible") ||
      !document.body.classList.contains("loaded") ||
      window.innerWidth < 1025
    ) {
      return;
    }

    this.block.style.zIndex = -1;
    phrasesInstance.show();
  };

  updateHeaderBackButton = () => {
    if (this.backButton && !this.block.dataset.excludeBack)
      this.backButton.href = this.previouseRoute;
  };

  onPageChangeComplete = () => {
    this.block.innerHTML =
      this.block.classList.contains("header--centered") ||
      this.block.classList.contains("header--illustratore")
        ? layoutCentered
        : this.block.classList.contains("header--lavoro")
        ? layoutLavoro
        : layout;

    this.onComplete();
    this.updateHeaderBackButton();
  };

  onComplete = () => {
    this.logo = this.block.querySelector(".header__logo");
    this.backButton = this.block.querySelector(".header__back");
    this.phrases = document.querySelector(".no-mo-phrases");

    if (this.logo) {
      this.logo.removeEventListener("mouseenter", this.onLogoEnter);
      this.logo.addEventListener("mouseenter", this.onLogoEnter);
    }
  };
}
