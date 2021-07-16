import "@styles/common.css";
import "@styles/font.css";
import "@styles/typography.css";
import "@styles/base.css";
import "@styles/layout.css";

import Footer from "@blocks/footer";

import StrokeText from "@components/StrokeText";

import Raf from "@utils/Raf";

const MODULES = [Footer, StrokeText];

class App {
  lastIndex = 0;

  constructor() {
    window.addEventListener("DOMContentLoaded", this.initApp);
    window.addEventListener("load", this.loadApp);
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
  }

  initApp = () => {
    this.lastIndex = 0;
    this.raf = new Raf();

    this.instances = MODULES.flatMap((Module) => {
      if ("selector" in Module) {
        const blocks = [...document.querySelectorAll(Module.selector)];

        return blocks.map((block) => {
          block.setAttribute("data-instance-index", this.lastIndex);
          this.lastIndex += 1;
          return new Module(block);
        });
      }
      return null;
    }).filter(Boolean);

    for (const instance of this.instances) {
      if (instance.onReady) {
        instance.onReady();
      }
    }
  };

  loadApp = () => {
    document.body.classList.add("loaded");
  };

  onResize = (e) => {
    if (!this.instances) {
      return;
    }

    for (const instance of this.instances) {
      if (instance.onResize) {
        // instance.onResize(e, { changedView });
        instance.onResize(e);
      }
    }
  };

  onScroll = (e) => {
    if (!this.instances) {
      return;
    }

    for (const instance of this.instances) {
      if (instance.onScroll) {
        instance.onScroll(e);
      }
    }
  };
}

window.App = new App();

export const getRaf = () => {
  return window.App.raf;
};
