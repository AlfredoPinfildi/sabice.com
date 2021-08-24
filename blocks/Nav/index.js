import "./style.css";
import layout from "./layout.html";
import layoutIllustratore from "./layout_illustratore.html";

import { getInstance } from "@app";

export default class Nav {
  static selector = ".nav";

  constructor(block) {
    this.block = block;

    this.block.innerHTML = this.block.classList.contains("nav--illustrator")
      ? layoutIllustratore
      : layout;

    this.anchors = block.querySelectorAll(".nav__menu__voice a");
    this.animatedTexts = block.querySelectorAll(".animated-text");

    this.duration = 1000;
    this.animatedTextsInstances = [];
  }

  onReady = () => {};

  onComplete = () => {
    this.openButton = document.querySelector(".open-nav");
    this.closeButton = document.querySelector(".nav__header__close");

    this.closeButton.addEventListener("click", this.close);

    this.updateActiveNavLink(window.location.pathname.replace(/\/$/, ""));

    if (this.openButton) {
      this.openButton.addEventListener("click", () => {
        document.body.style.overflow = "hidden";
        this.show();
        this.block.style.pointerEvents = "initial";

        setTimeout(() => {
          this.animatedTextsInstances.forEach((instance) => {
            if (instance.show) {
              instance.show();
            }
          });
        }, this.duration / 2);
      });
    }

    if (this.animatedTexts) {
      this.animatedTexts.forEach((node) => {
        const instance = getInstance(node);

        if (instance) {
          this.animatedTextsInstances.push(instance);
        }
      });
    }
  };

  onPageChangeComplete = () => {
    this.onComplete();

    if (!this.openButton) {
      this.openButton = document.querySelector(".open-nav");

      if (!this.openButton) {
        return;
      }

      this.openButton.addEventListener("click", () => {
        document.body.style.overflow = "hidden";
        this.show();
        this.block.style.pointerEvents = "initial";

        setTimeout(() => {
          this.animatedTextsInstances.forEach((instance) => {
            if (instance.show) {
              instance.show();
            }
          });
        }, this.duration / 2);
      });
    }
  };

  changePage = () => {
    this.close();
  };

  close = () => {
    document.body.style.overflow = null;
    this.animatedTextsInstances.forEach((instance) => {
      if (instance.hide) {
        instance.hide();
      }
    });
    this.block.style.pointerEvents = null;

    setTimeout(() => {
      this.hide();
    }, this.duration / 4);
  };

  show = () => {
    this.block.classList.add("nav--visible");
  };

  hide = () => {
    this.block.classList.remove("nav--visible");
  };

  updateActiveNavLink = (route) => {
    this.anchors &&
      this.anchors.forEach((anchor) => {
        anchor.classList.toggle(
          "underline--active",
          anchor.getAttribute("href").replace(/\/$/, "") ===
            route.replace(/\/$/, "")
        );
      });
  };
}
