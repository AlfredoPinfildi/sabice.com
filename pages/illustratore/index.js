import "./style.css";

import { easeInOutCirc } from "@utils/easing.js";
import clamp from "@utils/clamp.js";
import { push } from "@router/History.js";
import { getInstance } from "@app";

export default class Illustratore {
  static selector = ".illustratore";

  constructor(block) {
    this.block = block;
    this.header = document.querySelector("header");
    this.footer = document.querySelector("footer");
    this.imageWrapper = document.querySelector(".illustratore__image-wrapper");
    this.svgText = block.querySelector(".illustratore__image-wrapper svg g");

    this.mounted = false;

    this.mountCallbacks = [];
    this.unmountDuration = 2000;
    this.unmountStyles = {
      translateY: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue:
          window.innerWidth > 1024
            ? window.innerHeight / 2 - 27
            : window.innerHeight / 2 - 16,
        setValue: (progress) => {
          return this.unmountStyles.translateY.toValue * progress;
        },
      },

      imageWrapperScale: {
        current: 1,
        ease: easeInOutCirc,
        fromValue: 1,
        toValue: 47 / this.imageWrapper.offsetHeight,
        setValue: (progress) => {
          return (
            1 - (1 - this.unmountStyles.imageWrapperScale.toValue) * progress
          );
        },
      },

      _translateY: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue: this.imageWrapper.offsetHeight / 2,
        setValue: (progress) => {
          return this.unmountStyles._translateY.toValue * progress;
        },
      },

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
  }

  onReady = () => {
    this.headerInstance = getInstance(this.header);
    this.footerInstance = getInstance(this.footer);
    this.block.addEventListener("wheel", this.unmount, { once: true });
    this.block.addEventListener("touchmove", this.unmount, { once: true });
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  onComplete = () => {
    this.mounted = true;

    this.scrollTimer = setTimeout(this.unmount, 2000);
  };

  unmount = () => {
    const mousePointerNode = document.querySelector(".mouse-pointer");
    mousePointerNode.classList.add("mouse-pointer--reset");
    push("/illustrazioni/");
  };

  unmountToIllustrazioni = () => {
    if (this.headerInstance && this.headerInstance.unmount) {
      this.headerInstance.unmount(true);
    }

    if (this.footerInstance && this.footerInstance.unmount) {
      this.footerInstance.unmount(true);
    }

    setTimeout(() => {
      this.block.style.zIndex = "1001";
      requestAnimationFrame(this.animateUnmount);
    }, 400);
  };

  animateUnmount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) / this.unmountDuration,
        0,
        1
      )
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
      setTimeout(() => {
        this.block.style.transition = "none";
        this.block.style.opacity = 0;
        this.block.style.zIndex = null;
        document.body.removeChild(this.block);
      }, 800);
    }
  };

  unmountLayout = () => {
    this.svgText.style.opacity = this.unmountStyles.opacity.current;
    this.imageWrapper.style.transform = `translateY(-${this.unmountStyles.translateY.current}px) scale(${this.unmountStyles.imageWrapperScale.current}) translateY(${this.unmountStyles._translateY.current}px)`;
  };

  mount = () => {
    if (
      this.headerInstance &&
      this.headerInstance.mount &&
      window.innerWidth < 1025
    ) {
      this.headerInstance.mount();
    }

    this.mountCallbacks.forEach((callback, i) => {
      callback();
      this.mountCallbacks.splice(i, 1);
    });

    /*requestAnimationFrame(this.animateMount);*/
  };

  animateMount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeOutQuint(
      clamp(
        (timestamp - this.animationStartTimestamp) / this.mountDuration,
        0,
        1
      )
    );

    for (const key in this.mountStyles) {
      this.mountStyles[key].current = this.mountStyles[key].setValue(progress);
    }

    this.mountLayout();

    if (progress < 1) {
      this.raf = requestAnimationFrame(this.animateMount);
    } else {
      cancelAnimationFrame(this.raf);
      this.animationStartTimestamp = null;

      this.mountCallbacks.forEach((callback, i) => {
        callback();
        this.mountCallbacks.splice(i, 1);
      });
    }
  };

  mountLayout = () => {
    this.block.style.opacity = this.mountStyles.opacity.current;
  };

  mountedFromHome = () => {
    if (window.innerWidth < 1025) {
      if (this.headerInstance && this.headerInstance.mount) {
        this.headerInstance.mount();
      }

      if (this.footerInstance && this.footerInstance.mount) {
        this.footerInstance.mount();
      }
    }
  };
}
