import "@styles/font.css";
import "@styles/typography.css";
import "@styles/base.css";
import "@styles/layout.css";
import "@styles/locomotive-scroll.css";

import Loader from "@components/Loader";
import MousePointer from "@components/MousePointer";
import AnimatedText from "@components/AnimatedText";
import Tags from "@components/Tags";
import ClippedImage from "@components/ClippedImage";
import ImagePlaceholder from "@components/ImagePlaceholder";
import ProjectHero from "@components/ProjectHero";
import Anchor from "@components/Anchor";
import ProjectVideo from "@components/ProjectVideo";
import DraggableCarousel from "@components/DraggableCarousel";

import Landscape from "@blocks/Landscape";
import Nav from "@blocks/Nav";
import NoMorePhrases from "@blocks/NoMorePhrases";
import Header from "@blocks/Header";
import Footer from "@blocks/Footer";
import NextProject from "@blocks/NextProject";

import Home from "@pages/Home";
import About from "@pages/About";
import Credits from "@pages/Credits";
import Illustrazioni from "@pages/Illustrazioni";
import Lavori from "@pages/Lavori";
import Designer from "@pages/Designer";
import Illustratore from "@pages/Illustratore";
import Lavoro from "@pages/Lavoro";
import NotFound from "@pages/404";

import Raf from "@utils/Raf";
import vh from "@utils/vh";
import Observer from "@utils/Observer";
import Router from "@router/index.js";

import "@styles/common.css";

const MODULES = [
  Header,
  Nav,
  Footer,
  Landscape,
  AnimatedText,
  Tags,
  NoMorePhrases,
  NextProject,
  ClippedImage,
  DraggableCarousel,
  ImagePlaceholder,
  ProjectHero,
  Anchor,
  ProjectVideo,
  Home,
  About,
  Credits,
  Illustrazioni,
  Lavori,
  Designer,
  Illustratore,
  Lavoro,
  NotFound,
];

class App {
  lastIndex = 0;

  constructor() {
    window.addEventListener("DOMContentLoaded", this.prepareToInitApp);
    window.addEventListener("beforeunload", () => {
      window.scrollTo(0, 0);
    });
    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll);
  }

  prepareToInitApp = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        function (registration) {
          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          // registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        }
      );
    }

    this.Observer = new Observer();
    this.raf = new Raf();
    this.mousePointer = new MousePointer();
    this.Router = new Router();

    this.initApp();
  };

  initApp = () => {
    document.documentElement.style.setProperty("--vh", `${vh()}px`);
    document.documentElement.style.setProperty("--dvh", `${vh()}px`);

    this.lastIndex = 0;

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

    const loader = new Loader();

    if (loader.subscribe) {
      loader.subscribe(() => {
        document.documentElement.style.setProperty("--vh", `${vh()}px`);
        document.documentElement.style.setProperty("--dvh", `${vh()}px`);

        this.instances.forEach((instance) => {
          if (instance.onComplete) {
            instance.onComplete();
          }
        });

        if (this.mousePointer.onComplete) {
          this.mousePointer.onComplete();
        }
      });
    }
  };

  initClones = () => {
    this.instances = this.instances.concat(
      MODULES.flatMap((module) => {
        if (!module.hasOwnProperty("selector")) {
          return;
        }

        const blocks = [...document.querySelectorAll(module.selector)];
        return blocks
          .map((block) => {
            const blockInstanceIndex = block.getAttribute(
              "data-instance-index"
            );
            if (blockInstanceIndex && blockInstanceIndex !== "") {
              return null;
            }

            block.setAttribute("data-instance-index", this.lastIndex);
            this.lastIndex++;
            return new module(block);
          })
          .filter((v) => !!v);
      })
    );

    this.instances.forEach((instance) => {
      if (instance.onReady && !instance.mounted) {
        instance.onReady();
      }
    });
  };

  getIsPageChanging = () => {
    return this.isPageChanging;
  };

  setIsPageChanging = (isChanging) => {
    this.isPageChanging = isChanging;
  };

  onPageChangeComplete = () => {
    this.setIsPageChanging(false);

    this.instances.forEach((instance) => {
      if (instance.onPageChangeComplete && !instance.mounted) {
        instance.onPageChangeComplete();
      }
    });
  };

  onResize = (e) => {
    if (!this.instances) {
      return;
    }

    document.documentElement.style.setProperty("--dvh", `${vh()}px`);

    for (const instance of this.instances) {
      if (instance.onResize && instance.mounted) {
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

export const getInstance = (el) => {
  const instanceIndex = el.getAttribute("data-instance-index");

  if (!instanceIndex) {
    return null;
  }

  return window.App.instances[parseInt(instanceIndex, 10)];
};

export const getObserver = () => {
  return window.App.Observer;
};
