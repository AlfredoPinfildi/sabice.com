import "./style.css";

import { easeInOutCirc } from "@utils/easing.js";
import clamp from "@utils/clamp.js";
import { getInstance } from "@app";
import { push } from "@router/History.js";

export default class Home {
  static selector = ".home";

  constructor(block) {
    this.block = block;
    this.directorNode = block.querySelector(
      ".home__container--director .home__container__content__image-wrapper"
    );
    this.illustratorNode = block.querySelector(
      ".home__container--illustrator .home__container__content__image-wrapper"
    );
    this.directorSideNode = block.querySelector(
      ".home__container--director .home__container__content"
    );
    this.illustratorSideNode = block.querySelector(
      ".home__container--illustrator .home__container__content"
    );
    this.separator = block.querySelector(".home__separator");
    this.header = document.querySelector("header");

    this.unmountCallbacks = [];
    this.unmountDuration = 2000;

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

  onReady = () => {
    if (this.header) {
      this.headerInstance = getInstance(this.header);
    }

    if (this.directorNode) {
      this.directorNode.addEventListener("mouseenter", () => {
        if (this.animating) return;

        this.block.classList.add("home__focus--left");
      });

      this.directorNode.addEventListener("mouseleave", () => {
        if (this.animating) return;

        this.block.classList.remove("home__focus--left");
      });
    }

    if (this.illustratorNode) {
      this.illustratorNode.addEventListener("mouseenter", () => {
        if (this.animating) return;

        this.block.classList.add("home__focus--right");
      });

      this.illustratorNode.addEventListener("mouseleave", () => {
        if (this.animating) return;

        this.block.classList.remove("home__focus--right");
      });
    }
  };

  onComplete = () => {
    if (window.innerWidth < 1025) {
      this.timer = setTimeout(() => {
        push("/designer/");
      }, 3000);
    }
  };

  unmount = (side) => {
    clearTimeout(this.timer);
    this.animating = true;
    this.side = side;
    this.target =
      side === "director" ? this.directorSideNode : this.illustratorSideNode;

    this.imageTarget =
      side === "director" ? this.directorNode : this.illustratorNode;
    this.block.classList.toggle("home__focus--left", side === "director");
    this.block.classList.toggle("home__focus--right", side === "illustrator");
    this.target.style.zIndex = "998";
    this.separator.style.transition = "none";
    this.imageTarget.style.transition = "none";
    this.imageTarget.classList.remove("cursor-type--hover");
    this.imageTarget.classList.add("cursor-type--click");

    if (this.directorNode) {
      this.directorNode.removeEventListener("mouseenter", () => {
        this.block.classList.add("home__focus--left");
      });

      this.directorNode.removeEventListener("mouseleave", () => {
        this.block.classList.remove("home__focus--left");
      });
    }

    if (this.illustratorNode) {
      this.illustratorNode.removeEventListener("mouseenter", () => {
        this.block.classList.add("home__focus--right");
      });

      this.illustratorNode.removeEventListener("mouseleave", () => {
        this.block.classList.remove("home__focus--right");
      });
    }

    window.requestAnimationFrame(this.animateUnmount);
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

    if (window.innerWidth > 1025) {
      this.target.style.width = `${100 + 100 * progress}%`;

      if (this.side === "illustrator") {
        this.target.style.left = `-${100 * progress}%`;
      }

      this.separator.style.transform = `translateX(calc(${
        this.side === "director" ? 50 * progress : -50 * progress
      }vw + ${this.side === "director" ? 8 : -8}px + ${
        this.side === "director" ? 40 * progress : -40 * progress
      }px))`;

      this.imageTarget.style.transform = `scale(${
        //1.1222707424 + 0.6888699105 * progress
        1.13 + 0.67 * progress
      })`;
    } else {
      this.header.style.opacity = 1 - 20 * progress;
      this.target.style.height = `${100 + 100 * progress}%`;

      if (this.side === "illustrator") {
        this.target.style.top = `-${100 * progress}%`;
      }

      this.imageTarget.style.transform = `scale(${
        this.side === "illustrator"
          ? 1 + 0.6938194444 * progress
          : 1 + 0.305555555556 * progress
      })`;
    }

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateUnmount);
    } else {
      window.cancelAnimationFrame(this.raf);
      this.unmountCallbacks.forEach((callback) => {
        callback();
      });
    }
  };

  registerUnmountCallback = (callback) => {
    this.unmountCallbacks.push(callback);
  };

  mount = () => {
    if (this.headerInstance) {
      this.headerInstance.mount();
    }

    requestAnimationFrame(this.animateMount);
  };

  animateMount = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
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
      this.raf = null;
    }
  };

  mountLayout = () => {
    this.block.style.opacity = this.mountStyles.opacity.current;
  };
}
