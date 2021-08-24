import "./style.css";
import clamp from "/utils/clamp.js";

export default class DraggableCarousel {
  static get selector() {
    return ".draggable-carousel";
  }

  constructor(block) {
    this.block = block;
    this.images = this.block.querySelectorAll(
      ".draggable-carousel__image-wrapper"
    );
    this.imagesWrapper = this.block.querySelector(
      ".draggable-carousel__images-wrapper"
    );

    this.x0 = 0;
    this.x = 0;
    this.dX0 = 0;
    this.dX = 0;
    this.translationX = 0;
    this.translationAmount = 0.15;
    this.index = 0;
    this.deltaX = 0;
    this.deltaX0 = 0;
    this.image;
    this.enterTransitionDuration = 1600;
    this.timer = null;

    this.block.addEventListener("touchstart", this.onTouchStart, {
      passive: true,
    });
    this.block.addEventListener("touchmove", this.onTouchMove, {
      passive: true,
    });
    this.block.addEventListener("touchend", this.onTouchEnd, {
      passive: true,
    });
    this.block.addEventListener("mousedown", this.onTouchStart);
    this.block.addEventListener("mousemove", this.onTouchMove);
    this.block.addEventListener("mouseup", this.onTouchEnd);
    this.block.addEventListener("mouseleave", this.onMouseOut);
  }

  onResize = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.isDesktop = window.innerWidth > 1024;
      if (this.isDesktop) {
        this.index = 0;
      }

      this.setImagesRect();

      this.block.style.cursor = null;

      this.updateIndex();

      this.x0 = null;
      this.x = null;

      this.render();
    }, 400);
  };

  onReady = () => {
    this.setImagesRect();
    this.isDesktop = window.innerWidth > 1024;
  };

  setImagesRect = () => {
    if (!this.images || this.images.length < 2) {
      return null;
    }

    this.images[0].rect = this.images[0].getBoundingClientRect();
    this.images[1].rect = this.images[1].getBoundingClientRect();

    this.imageMarginRight = this.getItemMarginRight();
    this.imageWidth = this.images[0].rect.width + this.imageMarginRight;
  };

  getItemMarginRight = () => {
    if (!this.images || this.images.length < 2) {
      return null;
    }

    return (
      this.images[1].rect.left -
      (this.images[0].rect.width + this.images[0].rect.left)
    );
  };

  onTouchStart = (e) => {
    if (this.isDesktop) {
      return;
    }
    this.block.style.cursor = "grabbing";
    this.x0 = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;

    if (!this.raf) {
      this.render();
    }
  };

  onTouchMove = (e) => {
    if (!this.x0) {
      return;
    }

    this.x = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;

    this.dX = this.x - this.x0 + this.index * this.imageWidth;

    this.deltaX = this.x - this.x0;
  };

  onTouchEnd = (e) => {
    this.block.style.cursor = null;

    if (!this.x0 || !this.x) {
      this.x = null;
      this.x0 = null;

      return;
    }

    this.updateIndex();

    this.x = null;
    this.x0 = null;
  };

  onMouseOut = () => {
    if (!this.x0) {
      return;
    }

    this.block.style.cursor = null;

    this.updateIndex();

    this.x0 = null;
    this.x = null;
  };

  updateIndex = () => {
    if (Math.abs(this.deltaX) > this.imageWidth / 4) {
      this.index = this.deltaX < 0 ? this.index - 1 : this.index + 1;
      this.index = clamp(this.index, -(this.images.length - 1), 0);
    }

    this.dX = this.index * this.imageWidth;
    this.deltaX = 0;
  };

  render = () => {
    this.dX0 = this.dX0 + (this.dX - this.dX0) * 0.16;
    this.deltaX0 = this.deltaX0 + (this.deltaX - this.deltaX0) * 0.16;

    this.layout();

    if (
      Math.round(this.dX0) === Math.round(this.dX) &&
      this.x0 === null &&
      this.raf
    ) {
      window.cancelAnimationFrame(this.raf);
      this.raf = null;
    } else {
      this.raf = window.requestAnimationFrame(this.render);
    }
  };

  layout = () => {
    if (!this.imagesWrapper) {
      return;
    }

    this.imagesWrapper.style.transform = `translate3d(${this.dX0}px, 0, 0)`;
  };
}
