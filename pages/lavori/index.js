import "./style.css";

import clamp from "@utils/clamp";
import { easeOutQuint, easeInOutCirc } from "@utils/easing";
import works from "@data/works.js";
import { getInstance } from "@app";

export default class Lavori {
  static selector = ".lavori";

  constructor(block) {
    this.block = block;
    this.worksImages = block.querySelectorAll(".lavori__lavoro-cover");
    this.worksList = block.querySelector(".lavori__lista ul");
    this.listItems = this.block.querySelectorAll(".lavori__lista ul li");
    this.tags = block.querySelector(".tags");
    this.workTemplate = this.block.querySelector("#lavoro");
    this.header = document.querySelector("header.header--illustrazioni");
    this.footer = block.querySelector("section > .p3");
    this.worksListWrapper = block.querySelector(".lavori__lista");

    this.worksList.addEventListener("touchstart", this.onTouchStart);
    this.worksList.addEventListener("touchend", this.onTouchEnd);
    this.worksList.addEventListener("wheel", () => {
      this.firstTouch = true;
    });

    let hash = location.hash.substr(1);

    this.scrollTimer = null;
    this.liMarginTop = 27;
    this.animationDuration = 800;
    this.canUpdate = false;
    this.itemsPosition = [];
    this.currentCategory = hash.length > 0 ? hash : "branding";
    this.currentIndex = 0;
    this.animatedTextsInstances = [];
    this.selector = "lavori";

    this.fixPositionDuration = 800;
    this.fixPositionStyles = {
      scrollTop: {
        current: 1,
        ease: easeOutQuint,
        fromValue: 0,
        toValue: 0,
        setValue: (progress) => {
          return (
            this.fixPositionStyles.scrollTop.fromValue +
            (this.fixPositionStyles.scrollTop.fromValue -
              this.fixPositionStyles.scrollTop.toValue) *
              progress
          );
        },
      },
    };

    this.mountFromDesignerDuration = 2000;
    this.mountFromDesignerStyles = {
      translateY: {
        current: 0,
        ease: easeInOutCirc,
        fromValue: 0,
        toValue: -window.innerHeight,
        setValue: (progress) => {
          return this.mountFromDesignerStyles.translateY.toValue * progress;
        },
      },
    };

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

    this.unmountToProjectCallbacks = [];
    this.unmountToProjectDuration = 800;
    this.unmountToProjectStyles = {
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

  updateWorksByCategory = (category) => {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.currentCategory = category;
    this.currentIndex = 0;
    this.filteredWorks = works.filter((work) =>
      work.categories.includes(category)
    );
    this.updateList();

    window.App.initClones();

    this.listItems.forEach((item) => {
      item.texts = item.querySelectorAll(".animated-text__row");
    });

    this.listItems.forEach((item, i) => {
      item.texts[0].style.backgroundPositionY = `calc(-${
        this.itemsOffsetTop[i] - this.listItemHeight / 2
      }px + var(--scroll-p))`;

      item.texts[1].style.backgroundPositionY = `calc(-${
        this.itemsOffsetTop[i] - this.listItemHeight / 2
      }px + var(--scroll-p))`;
    });

    if (window.innerWidth < 1025) {
      this.setupItemsPositions();
      this.initScroll();
      if (!this.updateGradientRaf) {
        this.updateGradientRaf = requestAnimationFrame(this.gradientRender);
      }
    }

    this.animatedTextNodes = this.block.querySelectorAll(".animated-text");
    if (this.animatedTextNodes) {
      this.animatedTextNodes.forEach((node) => {
        const instance = getInstance(node);

        if (instance) {
          this.animatedTextsInstances.push(instance);
        }
      });
    }

    this.animatedTextsInstances.forEach((instance) => {
      if (instance.show) {
        instance.show();
      }
    });

    this.worksList.classList.remove("lavori__lista--changing");
    this.focusOnFirstWork();
  };

  updateList = () => {
    this.block.classList.remove("lavori--focusing");
    this.worksList.removeEventListener("scroll", this.onListScroll);
    this.worksList.parentElement.classList.add("lavori__lista--hidden");
    this.setupWorks();
    this.firstTouch = false;
  };

  setupWorks = () => {
    this.listItems.forEach((node) => {
      node.remove();
    });
    this.worksImages.forEach((item) => {
      item.remove();
    });

    this.filteredWorks.forEach((work, index) => {
      let workNode = this.setupWork(work, index);
      this.worksList.appendChild(workNode);

      const div = document.createElement("div");
      div.classList.add("lavori__lavoro-cover");
      div.style.backgroundImage = `url(${work.cover})`;
      div.dataset.index = index;
      this.block.appendChild(div);
    });
    this.worksImages = this.block.querySelectorAll(".lavori__lavoro-cover");

    this.listItems = [...this.worksList.querySelectorAll("li")];
    this.listItems.forEach((item) => {
      const a = item.querySelector("a");
      item.addEventListener("mouseenter", this.onListItemEnter);
      item.addEventListener("mouseleave", this.onListItemOut);
    });

    this.itemsAmount = this.listItems.length;

    this.setupListItemHeight();
    this.setupItemsOffsetTop();
  };

  setupWork = (work, index) => {
    let workNode = this.workTemplate.content.querySelector("li");
    let workLink = this.workTemplate.content.querySelector("h3 a");
    let workName = this.workTemplate.content.querySelector(
      ".lavori__lista__lavoro__name .animated-text__row span"
    );
    let workNameWrapper = this.workTemplate.content.querySelector(
      ".lavori__lista__lavoro__name .animated-text__row"
    );
    let workDate = this.workTemplate.content.querySelector(
      ".lavori__lista__lavoro__date .animated-text__row"
    );

    workNode.dataset.index = index;
    workDate.textContent = work.year;
    workName.textContent = work.name.small;
    workNameWrapper.dataset.large = work.name.large;
    workNameWrapper.dataset.medium = work.name.medium;
    workLink.href = `/lavori/${work.slug}/`;

    let clone = document.importNode(this.workTemplate.content, true);

    return clone;
  };

  setupItemsPositions = () => {
    this.itemsPosition = [];
    this.listItems.forEach((item, i) => {
      this.itemsPosition[i] =
        item.offsetTop -
        this.worksList.offsetTop +
        item.offsetHeight / 2 -
        this.worksList.offsetHeight / 2;
    });
  };

  setupItemsOffsetTop = () => {
    this.itemsOffsetTop = [];
    this.listItems.forEach((item, i) => {
      this.itemsOffsetTop[i] = item.offsetTop;
    });
  };

  setupListItemHeight = () => {
    this.listItemHeight = this.listItems[0].offsetHeight;
  };

  gradientRender = () => {
    this.updateGradientRaf = requestAnimationFrame(this.gradientRender);

    const sY = this.getScrollPos() - this.listItemHeight / 2;
    document.documentElement.style.setProperty("--scroll-p", `${sY}px`);
  };

  getScrollPos = () => {
    return (
      (this.worksList.pageYOffset || this.worksList.scrollTop) -
      (this.worksList.clientTop || 0)
    );
  };

  setScrollPos = (pos) => {
    this.worksList.scrollTop = pos;
  };

  initScroll = () => {
    this.setScrollPos(this.itemsPosition[0]);

    setTimeout(() => {
      this.worksList.addEventListener("scroll", this.onListScroll);
    }, 1000);
  };

  onListScroll = () => {
    clearTimeout(this.isScrolling);
    this.unfocus();
    this.unfocusFromFirstWork();

    this.scrollEnd = false;

    this.isScrolling = setTimeout(() => {
      if (!this.touching) this.focus();
    }, 200);
  };

  onListItemEnter = (e) => {
    if (
      window.innerWidth < 1025 ||
      this.block.classList.contains("lavori--exiting")
    ) {
      return;
    }
    this.currentIndex = parseInt(e.target.dataset.index, 10);
    this.focus();
  };

  onListItemOut = (e) => {
    if (
      window.innerWidth < 1025 ||
      this.block.classList.contains("lavori--exiting")
    ) {
      return;
    }
    this.unfocus();
  };

  focus = () => {
    if (window.innerWidth < 1025) {
      this.focused = true;

      let index = 0;
      const scrollPosition = this.getScrollPos();

      for (let i = 0; i < this.itemsPosition.length; i++) {
        if (
          (scrollPosition >= this.itemsPosition[i] &&
            scrollPosition < this.itemsPosition[i + 1]) ||
          i === this.itemsPosition.length - 1 ||
          scrollPosition < this.itemsPosition[0]
        ) {
          index = i;
          break;
        }
      }
      this.currentIndex = index;
    }

    this.worksImages[this.currentIndex].classList.add(
      "lavori__lavoro-cover--focusing"
    );
    this.listItems[this.currentIndex].classList.add(
      "lavori__lista__lavoro--focusing"
    );
    this.block.classList.add("lavori--focusing");
  };

  unfocus = () => {
    if (window.innerWidth < 1025) {
      if (!this.focused) return;
      this.focused = false;
    }

    const index = this.currentIndex % this.itemsAmount;
    this.worksImages[index].classList.remove("lavori__lavoro-cover--focusing");
    this.listItems[this.currentIndex].classList.remove(
      "lavori__lista__lavoro--focusing"
    );
    this.block.classList.remove("lavori--focusing");
  };

  focusOnFirstWork = () => {
    if (window.innerWidth > 1024) return;

    this.block.classList.add("lavori--first-focus");
    this.worksImages[this.currentIndex].classList.add(
      "lavori__lavoro-cover--focusing"
    );
  };

  unfocusFromFirstWork = () => {
    this.block.classList.remove("lavori--first-focus");
    this.worksImages[this.currentIndex].classList.remove(
      "lavori__lavoro-cover--focusing"
    );
  };

  onTouchStart = () => {
    this.touching = true;
    this.unfocus();
  };

  onTouchEnd = () => {
    this.touching = false;
    this.onListScroll();
  };

  mountFromDesigner = () => {
    setTimeout(() => {
      requestAnimationFrame(this.animateMountFromDesigner);
    }, 400);
  };

  animateMountFromDesigner = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeInOutCirc(
      clamp(
        (timestamp - this.animationStartTimestamp) /
          this.mountFromDesignerDuration,
        0,
        1
      )
    );

    for (const key in this.mountFromDesignerStyles) {
      this.mountFromDesignerStyles[key].current =
        this.mountFromDesignerStyles[key].setValue(progress);
    }

    this.mountFromDesignerLayout();

    if (progress < 1) {
      this.raf = window.requestAnimationFrame(this.animateMountFromDesigner);
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

  mountFromDesignerLayout = () => {
    this.block.style.transform = `translateY(${this.mountFromDesignerStyles.translateY.current}px)`;
  };

  unmount = () => {
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

  unmountToProject = () => {
    this.animatedTextsInstances.forEach((instance) => {
      if (instance.hideToTop) {
        instance.hideToTop();
      }
    });

    this.worksList.classList.add("lavori__lista--changing");
    this.block.classList.add("lavori--exiting");

    requestAnimationFrame(this.animateUnmountToProject);
  };

  animateUnmountToProject = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = easeOutQuint(
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
      this.block.style.transition = "none";
      this.block.style.opacity = 0;

      this.unmountCallbacks.forEach((callback, i) => {
        callback();
        this.unmountCallbacks.splice(i, 1);
      });
    }
  };

  unmountToProjectLayout = () => {
    this.tags.style.opacity = this.unmountToProjectStyles.opacity.current;
    this.footer.style.opacity = this.unmountToProjectStyles.opacity.current;
  };

  mountFromLavoro = () => {
    this.block.style.transition = "none";

    requestAnimationFrame(this.animateMount);
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

  registerMountCallback = (callback) => {
    this.mountCallbacks.push(callback);
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  onComplete = () => {
    this.mounted = true;
    this.updateWorksByCategory(this.currentCategory);
  };

  onReady = () => {
    this.listTop = this.worksList.getBoundingClientRect().y;
    this.headerInstance = getInstance(this.header);
    document.documentElement.style.setProperty(
      "--gradient-height",
      `${this.worksListWrapper.offsetHeight}px`
    );

    if (this.tags) {
      this.tagsInstance = getInstance(this.tags);
      if (this.tagsInstance && this.tagsInstance.registerOnChangeCallback) {
        this.tagsInstance.registerOnChangeCallback((category) => {
          if (this.changing) {
            return;
          }

          this.changing = true;
          this.unfocus();
          this.animatedTextsInstances.forEach((instance) => {
            if (instance.hideToTop) {
              instance.hideToTop();
            }
          });

          this.worksList.classList.add("lavori__lista--changing");
          this.unfocusFromFirstWork();

          setTimeout(() => {
            this.updateWorksByCategory(category);
            this.changing = false;
          }, 500);
        });
      }
    }
  };

  onResize = () => {
    if (!this.block.classList.contains(this.selector)) return;

    if (window.innerWidth < 1025) {
      document.documentElement.style.setProperty(
        "--gradient-height",
        `${this.worksListWrapper.offsetHeight}px`
      );
      this.setupItemsPositions();
      this.initScroll();
      if (!this.updateGradientRaf) {
        this.updateGradientRaf = requestAnimationFrame(this.gradientRender);
      }

      this.updateWorksByCategory(this.currentCategory);
    } else {
      this.unfocus();
    }
  };
}
