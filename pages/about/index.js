import "./style.css";

import { easeOutQuint } from "@utils/easing";
import clamp from "@utils/clamp";

import { getInstance } from "@app";
import { getRaf } from "@app";

import LocomotiveScroll from "locomotive-scroll";

import ScrollTop from "@blocks/ScrollTop";

export default class About {
  static selector = ".about";

  constructor(block) {
    this.block = block;
    this.header = document.querySelector("header");

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
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  destroyScroll = () => {
    this.scroll.destroy();
  };

  unmount = () => {
    this.block.style.transition = "none";
    if (this.headerInstance && this.headerInstance.unmount) {
      this.headerInstance.unmount();
    }

    const raf = getRaf();
    raf.register(this.block.dataset.instanceIndex, this.animateUnmount);
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

    if (progress >= 1) {
      const raf = getRaf();
      raf.unregister(this.block.dataset.instanceIndex);
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

  mount = () => {
    this.block.style.transition = "none";

    if (this.headerInstance && this.headerInstance.mount) {
      this.headerInstance.mount();
    }

    const raf = getRaf();
    raf.register(this.block.dataset.instanceIndex, this.animateMount);
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

    if (progress >= 1) {
      const raf = getRaf();
      raf.unregister(this.block.dataset.instanceIndex);
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
