import { listen } from "./History.js";
import { getInstance } from "/index.js";
import routes from "./routes.js";

export default class Router {
  constructor() {
    this.getContentFrom = this.getContentFrom.bind(this);
    this.startLoad = this.startLoad.bind(this);
    this.newContentReceived = this.newContentReceived.bind(this);
    this.startPageTransition = this.startPageTransition.bind(this);

    this.req = new XMLHttpRequest();
    this.currentRoute = window.location.pathname;

    listen((source, destination) => {
      window.App.setIsPageChanging(true);
      this.startLoad(source, destination);
    });

    window.addEventListener("popstate", () => {
      this.startLoad(
        this.currentRoute,
        window.location.pathname.replace(/\/$/, "")
      );
    });
  }

  startLoad(source, destination) {
    const hashIndex = destination.indexOf("#");
    if (hashIndex > 0) {
      destination = destination.substring(0, hashIndex - 1);
    }

    if (destination.length < 1) {
      window.location.reload();
      return;
    }

    const sourceRoute = routes[source];
    const destinationRoute = sourceRoute[destination];

    let sourceNode = document.querySelector(sourceRoute.selector);
    this.navVisible = document.querySelector(".nav--visible");

    if (sourceNode) {
      if (this.navVisible) {
        document.body.classList.remove("loaded");
        document.body.classList.add("no-transitions");
        sourceNode.style = null;

        this.getContentFrom(destinationRoute, sourceRoute);
      } else {
        switch (destinationRoute.mode) {
          case "continuous":
            this.getContentFrom(destinationRoute, sourceRoute);
            break;

          default:
            let sourceInstance = getInstance(sourceNode);
            if (sourceInstance.registerUnmountCallback) {
              sourceInstance.registerUnmountCallback(() => {
                this.getContentFrom(destinationRoute, sourceRoute);
              });
            }

            if (!destinationRoute.unmountParameter) {
              sourceInstance[destinationRoute.unmount]();
            } else {
              sourceInstance[destinationRoute.unmount](
                destinationRoute.unmountParameter
              );
            }
            break;
        }
      }
    }
  }

  getContentFrom(destination, source) {
    if (this.req != null) {
      this.req.open("GET", `${destination.slug}/`, true);
      this.req.onreadystatechange = () => {
        if (destination.mode === "continuous") {
          this.startPageTransition(destination, source);
        } else {
          this.newContentReceived(destination, source);
        }
      };
      this.req.send();
    } else {
    }
  }

  startPageTransition(destination, source) {
    if (this.req.readyState == 4 && this.req.status == 200) {
      let div = document.createElement("DIV");
      div.innerHTML = this.req.responseText;

      const receivedContentTitle = div.querySelector("title").innerText;
      const receivedContent = div.querySelector(destination.selector);
      const receivedContentHeader = div.querySelector("header");
      receivedContentHeader.style.opacity = 0;
      const contentHeader = document.querySelector("header");
      const actualScrollContainer = document.querySelector(
        "[data-scroll-container]"
      );
      const content = document.querySelector(source.selector);

      document.body.appendChild(receivedContent);
      document.title = receivedContentTitle;

      setTimeout(() => {
        if (
          contentHeader &&
          receivedContentHeader &&
          !destination.excludeHeader
        ) {
          contentHeader.before(receivedContentHeader);
        }

        if (receivedContentHeader.dataset.excludeBack) {
          contentHeader.dataset.excludeBack =
            receivedContentHeader.dataset.excludeBack;
        } else {
          contentHeader.removeAttribute("data-exclude-back");
        }

        const contentNoMo = document.querySelector(".no-mo-phrases");
        const receivedContentNoMo = div.querySelector(".no-mo-phrases");
        if (receivedContentNoMo) {
          if (contentNoMo) {
            contentNoMo.innerHTML = receivedContentNoMo.innerHTML;
            contentNoMo.classList = receivedContentNoMo.classList;
          } else {
            content.before(receivedContentNoMo);
          }
        }

        const contentNav = document.querySelector("nav");
        const receivedContentNav = div.querySelector("nav");
        if (receivedContentNav) {
          if (contentNav) {
            if (!destination.excludeNav) {
              contentNav.innerHTML = receivedContentNav.innerHTML;
              contentNav.classList = receivedContentNav.classList;
            }
            contentNav.removeAttribute("data-instance-index");
          } else if (!destination.excludeNav) {
            content.before(receivedContentNav);
          }
        }

        const landscape = document.querySelector(".landscape");
        const receivedLandscape = div.querySelector(".landscape");
        if (receivedLandscape && landscape) {
          landscape.classList = receivedLandscape.classList;
        }

        window.App.initClones();
        let sourceNode = document.querySelector(source.selector);
        let sourceInstance = getInstance(sourceNode);
        if (sourceInstance && sourceInstance.destroyScroll) {
          sourceInstance.destroyScroll();
        }

        if (
          ((receivedContent.querySelector("[data-scroll-container]") &&
            receivedContent.querySelector("[data-scroll-container]").dataset
              .scrollContainer) ||
            receivedContent.dataset.scrollContainer) &&
          actualScrollContainer
        ) {
          actualScrollContainer.dataset.scrollContainer = "";
        } else if (actualScrollContainer) {
          actualScrollContainer.removeAttribute("data-scroll-container");
        }

        let destinationNode = document.querySelector(destination.selector);
        let destinationInstance = getInstance(destinationNode);

        if (sourceInstance && destinationInstance) {
          if (destinationInstance.registerMountCallbacks) {
            destinationInstance.registerMountCallbacks(() => {
              document.body.className = "";
              if (destination.bodyClasses) {
                destination.bodyClasses.forEach((bodyClass) => {
                  document.body.classList.add(bodyClass);
                });
              }

              window.App.onPageChangeComplete();
            });
          }

          sourceInstance[destination.unmount]();
          destinationInstance[destination.mount]();

          this.currentRoute = window.location.pathname;

          const mousePointerNode = document.querySelector(".mouse-pointer");
          mousePointerNode.classList.remove("mouse-pointer--reset");
        }
      }, 100);
    }
  }

  newContentReceived(destination, source) {
    if (this.req.readyState == 4 && this.req.status == 200) {
      let sourceNode = document.querySelector(source.selector);
      let sourceInstance = getInstance(sourceNode);
      if (sourceInstance && sourceInstance.destroyScroll) {
        sourceInstance.destroyScroll();
      }

      let div = document.createElement("DIV");
      div.innerHTML = this.req.responseText;

      const receivedContentTitle = div.querySelector("title").innerText;
      document.title = receivedContentTitle;

      const receivedContent = div.querySelector(destination.selector);
      const content = document.querySelector(source.selector);

      content.removeAttribute("data-instance-index");
      content.className = "";
      receivedContent.classList.forEach((item) => {
        content.classList.add(item);
      });

      content.id = receivedContent.id;

      if (receivedContent.dataset.scrollContainer) {
        content.dataset.scrollContainer = "";
      } else {
        content.removeAttribute("data-scroll-container");
      }
      content.innerHTML = receivedContent.innerHTML;

      const receivedContentFooter = div.querySelector("footer");
      if (receivedContentFooter) {
        content.after(receivedContentFooter);
      }

      const contentHeader = document.querySelector("header");
      const receivedContentHeader = div.querySelector("header");
      if (receivedContentHeader) {
        if (contentHeader && !destination.excludeHeader) {
          //contentHeader.innerHTML = receivedContentHeader.innerHTML;
          contentHeader.classList = receivedContentHeader.classList;
        } else if (!destination.excludeHeader) {
          content.before(receivedContentHeader);
        }
      }

      const contentNoMo = document.querySelector(".no-mo-phrases");
      const receivedContentNoMo = div.querySelector(".no-mo-phrases");
      if (receivedContentNoMo) {
        if (contentNoMo) {
          contentNoMo.innerHTML = receivedContentNoMo.innerHTML;
          contentNoMo.classList = receivedContentNoMo.classList;
        } else {
          content.before(receivedContentNoMo);
        }
      }

      const landscape = document.querySelector(".landscape");
      const receivedLandscape = div.querySelector(".landscape");
      if (receivedLandscape && landscape) {
        landscape.classList = receivedLandscape.classList;
      }

      document.body.className = "";

      if (!this.navVisible) {
        const contentNav = document.querySelector("nav");
        const receivedContentNav = div.querySelector("nav");
        if (receivedContentNav) {
          if (contentNav) {
            if (!destination.excludeNav) {
              contentNav.innerHTML = receivedContentNav.innerHTML;
              contentNav.classList = receivedContentNav.classList;
            }
            contentNav.removeAttribute("data-instance-index");
          } else if (!destination.excludeNav) {
            content.before(receivedContentNav);
          }
        }

        if (destination.bodyClasses) {
          destination.bodyClasses.forEach((bodyClass) => {
            document.body.classList.add(bodyClass);
          });
        }

        window.App.initClones();

        setTimeout(() => {
          window.App.onPageChangeComplete();

          let destinationNode = document.querySelector(destination.selector);

          let destinationInstance = getInstance(destinationNode);
          destinationInstance[destination.mount]();
          const mousePointerNode = document.querySelector(".mouse-pointer");
          mousePointerNode.classList.remove("mouse-pointer--reset");
        }, 200);
      } else {
        const navInstance = getInstance(this.navVisible);
        navInstance.close();

        setTimeout(() => {
          const contentNav = document.querySelector("nav");
          const receivedContentNav = div.querySelector("nav");
          if (receivedContentNav) {
            if (contentNav) {
              if (!destination.excludeNav) {
                contentNav.innerHTML = receivedContentNav.innerHTML;
                contentNav.classList = receivedContentNav.classList;
              }
              contentNav.removeAttribute("data-instance-index");
            } else if (!destination.excludeNav) {
              content.before(receivedContentNav);
            }
          }

          if (destination.bodyClasses) {
            destination.bodyClasses.forEach((bodyClass) => {
              document.body.classList.add(bodyClass);
            });
          }
          window.App.initClones();

          window.App.onPageChangeComplete();
          const mousePointerNode = document.querySelector(".mouse-pointer");
          mousePointerNode.classList.remove("mouse-pointer--reset");
        }, 1450);
      }

      this.currentRoute = destination.slug;
    }
  }
}
