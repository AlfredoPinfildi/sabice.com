import "./style.css";

import { easeInOutCirc, easeOutQuint } from "@utils/easing.js";
import clamp from "@utils/clamp.js";
import { push } from "@router/History.js";
import { getInstance } from "@app";

export default class Designer {
  static selector = ".designer";

  constructor(block) {
    this.block = block;
    this.header = document.querySelector("header");
    this.footer = document.querySelector("footer");
    this.imageWrapper = document.querySelector(".designer__image-wrapper");
    this.svg = block.querySelector(".rs");

    this.mounted = false;

    this.mountCallbacks = [];
    this.mountDuration = 800;
    this.mountStyles = {
      opacity: {
        current: 0,
        ease: easeOutQuint,
        fromValue: 0,
        toValue: 1,
        setValue: (progress) => {
          return this.mountStyles.opacity.toValue * progress;
        },
      },
    };

    this.unmountDuration = 2000;
    this.unmountStyles = {
      translateY: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue:
          window.innerWidth > 1024
            ? window.innerHeight / 2 - 52.5
            : window.innerHeight / 2 - 41.5,
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
    push("/lavori/");
  };

  unmountToLavori = () => {
    if (this.headerInstance && this.headerInstance.unmount) {
      this.headerInstance.unmount(true);
    }

    if (this.footerInstance && this.footerInstance.unmount) {
      this.footerInstance.unmount(true);
    }

    setTimeout(() => {
      this.block.style.zIndex = "1001";
      this.svg.classList.add("rs--circles");
      this.svg.classList.remove("rs--text");
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
    this.imageWrapper.style.transform = `translateY(-${this.unmountStyles.translateY.current}px) scale(${this.unmountStyles.imageWrapperScale.current})`;
  };

  mount = () => {
    if (
      this.headerInstance &&
      this.headerInstance.mount &&
      window.innerWidth < 1025
    ) {
      this.headerInstance.mount();
    }

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

  registerMountCallback = (callback) => {
    this.mountCallbacks.push(callback);
  };

  mountedFromHome = () => {
    if (window.innerWidth < 1025) {
      if (this.headerInstance && this.headerInstance.unmount) {
        this.headerInstance.mount();
      }

      if (this.footerInstance && this.footerInstance.unmount) {
        this.footerInstance.mount();
      }
    }
  };
}
