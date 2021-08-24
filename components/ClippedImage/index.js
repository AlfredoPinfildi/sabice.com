import "./style.css";

import { getObserver } from "@app";

export default class ClippedImage {
  static selector = ".clipped-image";

  constructor(block) {
    this.block = block;

    this.image = block.querySelector(".clipped-image__image");

    this.transitionDuration = 1600;
    this.entranceDelegated = block.dataset.entrance;
  }

  onComplete = () => {
    if (!this.entranceDelegated || window.innerWidth < 1025) {
      this.block.dataset.intersectionRatio = 0.2;
      const observer = getObserver();
      observer.register(
        this.block.dataset.instanceIndex,
        this.show,
        this.block
      );
    }
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  show = () => {
    const observer = getObserver();
    observer.unregister(this.block);
    this.block.classList.add("clipped-image--visible");
  };
}
