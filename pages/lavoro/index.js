import "./style.css";

import { easeInOutCirc, easeOutQuint, easeInOutQuint } from "@utils/easing";
import clamp from "@utils/clamp";

import { getInstance } from "@app";

import LocomotiveScroll from "locomotive-scroll";

export default class Lavoro {
  static selector = ".project";

  constructor(block) {
    this.block = block;
    this.header = document.querySelector("header");
    this.container = block.querySelector(".project__content");

    this.unmountCallbacks = [];
    this.unmountDuration = 800;
    this.unmountStyles = {
      opacity: {
        current: 1,
        ease: easeOutQuint,
        fromValue: 1,
        toValue: 0,
        setValue: (progress) => {
          return this.unmountStyles.opacity.fromValue * (1 - progress);
        },
      },
    };

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

    this.unmountToProjectDuration = 1600;
    this.unmountToProjectStyles = {
      translateY: {
        current: 0,
        ease: easeInOutQuint,
        fromValue: 0,
        toValue: window.innerHeight,
        setValue: (progress) => {
          return this.unmountToProjectStyles.translateY.toValue * progress;
        },
      },
    };

    this.mountFromProjectDuration = 1600;
    this.mountFromProjectStyles = {
      translateY: {
        current: 0,
        ease: easeInOutQuint,
        fromValue: 0,
        toValue: -window.innerHeight,
        setValue: (progress) => {
          return this.mountFromProjectStyles.translateY.toValue * progress;
        },
      },
    };
  }

  onResize = () => {
    this.unmountToProjectStyles.translateY.toValue = window.innerHeight;
    this.mountFromProjectStyles.translateY.toValue = -window.innerHeight;
  };

  onReady = () => {
    this.headerInstance = getInstance(this.header);
  };

  onComplete = () => {
    this.mounted = true;

    this.scroll = new LocomotiveScroll({
      el: this.container,
      smooth: true,
      tablet: { smooth: false },
      smartphone: { smooth: false },
    });
  };

  onPageChangeComplete = () => {
    setTimeout(() => {
      this.onComplete();
    }, 200);
  };

  destroyScroll = () => {
    this.scroll.destroy();
  };

  mountFromProject = () => {
    //setTimeout(() => {
    requestAnimationFrame(this.animateMountFromProject);
    //}, 400);
  };

  animateMountFromProject = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) /
          this.mountFromProjectDuration,
        0,
        1
      )
    );

    for (const key in this.mountFromProjectStyles) {
      this.mountFromProjectStyles[key].current =
        this.mountFromProjectStyles[key].setValue(progress);
    }

    this.mountFromProjectLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateMountFromProject);
    } else {
      window.cancelAnimationFrame(this.raf);
      this.animationStartTimestamp = null;

      this.onReady();

      window.App.onPageChangeComplete();

      this.block.style.transform = null;
      /*setTimeout(() => {
      }, 800);*/
    }
  };

  mountFromProjectLayout = () => {
    this.block.style.transform = `translateY(${this.mountFromProjectStyles.translateY.current}px)`;
  };

  unmountToProject = () => {
    document.body.style.overflow = "hidden";
    //setTimeout(() => {
    requestAnimationFrame(this.animateUnmountToProject);
    //}, 400);
  };

  animateUnmountToProject = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) /
          this.unmountToProjectDuration,
        0,
        1
      )
    );

    for (const key in this.unmountToProjectStyles) {
      this.unmountToProjectStyles[key].current =
        this.unmountToProjectStyles[key].setValue(progress);
    }

    this.unmountToProjectLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateUnmountToProject);
    } else {
      window.cancelAnimationFrame(this.raf);
      this.animationStartTimestamp = null;
      document.body.removeChild(this.block);
      document.body.style.overflow = null;
      window.scrollTo(0, 0);
    }
  };

  unmountToProjectLayout = () => {
    this.block.style.transform = `translateY(-${this.unmountToProjectStyles.translateY.current}px)`;
  };

  unmount = () => {
    this.block.style.transition = "none";

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

  registerUnmountCallback(callback) {
    this.unmountCallbacks.push(callback);
  }

  mountFromProjects = () => {
    this.block.style.transition = "none";

    requestAnimationFrame(this.animateMount);
  };

  mount = () => {
    this.block.style.transition = "none";

    if (this.headerInstance && this.headerInstance.unmount) {
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

  registerMountCallback = (callback) => {
    this.mountCallbacks.push(callback);
  };
}
