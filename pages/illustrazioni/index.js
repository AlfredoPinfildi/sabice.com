import "./style.css";

import { easeInOutCirc, easeOutQuint } from "@utils/easing";
import clamp from "@utils/clamp";

import { getInstance } from "@app";

import ScrollTop from "@blocks/ScrollTop";

import LocomotiveScroll from "locomotive-scroll";

export default class Illustrazioni {
  static selector = ".illustrazioni";

  constructor(block) {
    this.block = block;

    this.introArrows = block.querySelectorAll(".illustrazioni__intro__arrow");
    this.header = document.querySelector("header.header--illustrazioni");
    this.nav = document.querySelector("nav");

    this.introArrows.forEach((arrow) => {
      arrow.addEventListener("click", (e) => {
        e.preventDefault();
        this.scrollDown();
      });
    });

    this.mountCallbacks = [];
    this.mountFromIllustratoreDuration = 2000;
    this.mountFromIllustratoreStyles = {
      translateY: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue: -window.innerHeight,
        setValue: (progress) => {
          return this.mountFromIllustratoreStyles.translateY.toValue * progress;
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

    this.unmountCallbacks = [];
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
  }

  onReady = () => {
    this.headerInstance = getInstance(this.header);
  };

  onComplete = () => {
    this.mounted = true;
    this.scroll = new LocomotiveScroll({
      el: this.block,
      smooth: true,
      tablet: { smooth: false },
      smartphone: { smooth: false },
    });

    this.scrollTop = new ScrollTop(
      this.block.querySelector(".scroll-top"),
      this.scroll
    );

    this.scrollTimer = setTimeout(this.scrollDown, 5000);

    this.scroll.on("scroll", () => {
      this.onScroll();
    });
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  destroyScroll = () => {
    this.scroll.destroy();
  };

  onScroll = () => {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  };

  scrollDown = () => {
    if (
      this.nav.classList.contains("nav--visible") ||
      !this.block.classList.contains("illustrazioni")
    ) {
      return;
    }

    this.scroll.scrollTo(window.innerHeight);
  };

  mount = () => {
    this.block.style.transition = "none";
    if (this.headerInstance && this.headerInstance.mount) {
      this.headerInstance.mount();
    }

    requestAnimationFrame(this.animateMount);
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

  mountFromIllustratore = () => {
    setTimeout(() => {
      requestAnimationFrame(this.animateMountFromIllustratore);
    }, 400);
  };

  animateMountFromIllustratore = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) /
          this.mountFromIllustratoreDuration,
        0,
        1
      )
    );

    for (const key in this.mountFromIllustratoreStyles) {
      this.mountFromIllustratoreStyles[key].current =
        this.mountFromIllustratoreStyles[key].setValue(progress);
    }

    this.mountFromIllustratoreLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(
        this.animateMountFromIllustratore
      );
    } else {
      if (this.headerInstance && this.headerInstance.mount) {
        this.headerInstance.mount();
      }

      window.cancelAnimationFrame(this.raf);
      this.animationStartTimestamp = null;

      this.onReady();

      this.mountCallbacks.forEach((callback, i) => {
        callback();
        this.mountCallbacks.splice(i, 1);
      });

      window.App.onPageChangeComplete();

      setTimeout(() => {
        this.block.style.transform = null;
      }, 800);
    }
  };

  mountFromIllustratoreLayout = () => {
    this.block.style.transform = `translateY(${this.mountFromIllustratoreStyles.translateY.current}px)`;
  };

  unmount = () => {
    this.block.style.transition = "none";
    if (this.headerInstance && this.headerInstance.unmount) {
      this.headerInstance.unmount();
    }

    requestAnimationFrame(this.animateUnmount);
  };

  animateUnmount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeOutQuint(
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
      this.animationStartTimestamp = null;

      this.unmountCallbacks.forEach((callback, i) => {
        callback();
        this.unmountCallbacks.splice(i, 1);
      });
    }
  };

  unmountLayout = () => {
    this.block.style.opacity = this.unmountStyles.opacity.current;
  };

  registerMountCallbacks = (callback) => {
    this.mountCallbacks.push(callback);
  };

  registerUnmountCallback = (callback) => {
    this.unmountCallbacks.push(callback);
  };
}
