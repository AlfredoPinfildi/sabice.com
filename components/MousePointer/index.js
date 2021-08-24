import "./style.css";

import isTablet from "@utils/isTablet";

import { getRaf } from "@app";

export default class MousePointer {
  static selector = ".mouse-pointer";

  constructor() {
    this.block = document.querySelector(".mouse-pointer");

    this.x0 = 0;
    this.y0 = 0;
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.scale = 0.5;
    this.clicking = false;

    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mousedown", () => {
      this.clicking = true;
    });
    window.addEventListener("mouseup", () => {
      this.clicking = false;
    });

    this.block.classList.add("mouse-pointer--loading");
    this.update();

    if (isTablet) {
      this.block.classList.add("mouse-pointer--tablet");
      this.block.style.display = "none !important";
    }
  }

  onMouseMove = (e) => {
    this.block.classList.remove("mouse-pointer--hidden");
    this.x = e.clientX;
    this.y = e.clientY;
    this.target = e.target;
  };

  updateByTarget = () => {
    if (!this.target) {
      return;
    }

    const cursorTypeNode = this.target.closest(".cursor-type");

    this.block.classList.toggle(
      "mouse-pointer--hover",
      cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--hover") &&
        !this.block.classList.contains("mouse-pointer--reset")
    );

    this.block.classList.toggle(
      "mouse-pointer--scroll-down",
      cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--scroll-down") &&
        !this.block.classList.contains("mouse-pointer--reset")
    );

    this.block.classList.toggle(
      "mouse-pointer--click",
      ((cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--click")) ||
        this.clicking) &&
        !this.block.classList.contains("mouse-pointer--reset")
    );

    this.block.classList.toggle(
      "mouse-pointer--loading",
      cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--loading") &&
        !this.block.classList.contains("mouse-pointer--reset") &&
        !this.loaded
    );

    this.block.classList.toggle(
      "mouse-pointer--click-hold",
      cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--click-hold") &&
        !this.block.classList.contains("mouse-pointer--reset")
    );

    this.block.classList.toggle(
      "mouse-pointer--play",
      cursorTypeNode &&
        cursorTypeNode.classList.contains("cursor-type--play") &&
        !this.block.classList.contains("mouse-pointer--reset")
    );

    if (this.block.classList.contains("mouse-pointer--reset")) {
      this.target = null;
    }
  };

  update = () => {
    this.updateByTarget();

    this.block.style.transform = `translate3d(calc(${this.x}px - 50%), calc(${this.y}px - 50%), 0)`;

    if (!this.raf) {
      this.raf = getRaf();
      this.raf.register("mouse-pointer", this.update);
    }
  };

  onComplete = () => {
    this.loaded = true;
    this.block.classList.remove("mouse-pointer--loading");
  };
}
