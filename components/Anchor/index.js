import { push } from "@router/History.js";
import clamp from "@utils/clamp.js";
import { easeInOutCirc } from "@utils/easing.js";

export default class Anchor {
  static selector = "a";

  constructor(block) {
    this.block = block;

    this.transitionDuration = 2000;
    this.action = this.block.getAttribute("href");
    this.longPressure = this.block.dataset.longPressure ? true : false;
  }

  onReady = () => {
    this.mounted = true;

    this.block.addEventListener("click", this.onClick);
    if (this.longPressure) {
      this.block.addEventListener("touchstart", this.onTouchStart);
      this.block.addEventListener("touchmove", this.onTouchMove);
      this.block.addEventListener("touchend", this.onTouchEnd);
      this.block.addEventListener("mousedown", this.onTouchStart);
      this.block.addEventListener("mousemove", this.onTouchMove);
      this.block.addEventListener("mouseleave", this.onTouchEnd);
      this.block.addEventListener("mouseup", this.onTouchEnd);
    }
  };

  onClick = (e) => {
    this.action = this.block.getAttribute("href");

    if (this.action.startsWith("/") && !this.longPressure) {
      e.preventDefault();
      this.resetMousePointer();
      push(this.action);
    } else if (this.action.startsWith("#") && !this.longPressure) {
      e.preventDefault();

      this.target = document.querySelector(this.action);
      this.scrollY = window.pageYOffset;
      this.raf = requestAnimationFrame((timestamp) => {
        this.animate(timestamp, this.target.getBoundingClientRect().top);
      });
    } else if (this.longPressure) {
      e.preventDefault();
    }
  };

  onTouchStart = (e) => {
    this.block.addEventListener("transitionend", this.onLongPressureComplete);
    this.block.classList.add("next-project__item--clicking");

    this.x0 = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
  };

  onTouchMove = (e) => {
    if (!this.x0) {
      return;
    }

    this.x = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    this.dX = this.x - this.x0;

    if (Math.abs(this.dX) > 10 && !window.App.getIsPageChanging()) {
      this.block.removeEventListener(
        "transitionend",
        this.onLongPressureComplete
      );
      this.block.classList.remove("next-project__item--clicking");
    }
  };

  onTouchEnd = () => {
    this.dX = this.x = this.x0 = 0;

    this.block.removeEventListener(
      "transitionend",
      this.onLongPressureComplete
    );

    this.block.classList.remove("next-project__item--clicking");
  };

  onLongPressureComplete = () => {
    this.block.removeEventListener("touchend", this.onTouchEnd);
    this.block.removeEventListener("mouseleave", this.onTouchEnd);
    this.block.removeEventListener("mouseup", this.onTouchEnd);
    this.block.classList.add("next-project__item--clicking");

    this.block.removeEventListener(
      "transitionend",
      this.onLongPressureComplete
    );

    this.resetMousePointer();
    push(this.action);
  };

  animate = (timestamp, destination) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) / this.transitionDuration,
        0,
        1
      )
    );

    window.scrollTo(0, this.scrollY + destination * progress);

    if (progress < 1) {
      this.raf = requestAnimationFrame((t) => {
        this.animate(t, destination);
      });
    } else {
      cancelAnimationFrame(this.raf);
      this.raf = null;
      this.animationStartTimestamp = null;
    }
  };

  resetMousePointer = () => {
    const mousePointerNode = document.querySelector(".mouse-pointer");
    mousePointerNode.classList.add("mouse-pointer--reset");
  };
}
