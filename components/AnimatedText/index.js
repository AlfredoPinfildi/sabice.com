import "./style.css";
import { getObserver } from "@app";

export default class AnimatedText {
  static selector = ".animated-text";

  constructor(block) {
    this.block = block;

    this.splitted = this.block.dataset.splitted;
    this.transitionDuration = 1600;
    this.entranceDelegated = block.dataset.entrance;
    this.hiding = false;
  }

  onResize = () => {
    if (this.vw && window.innerWidth === this.vw) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.setupRows();
    }, 400);
  };

  onReady = () => {
    this.setupRows();
    this.vw = window.innerWidth;
  };

  onComplete = () => {
    if (!this.entranceDelegated) {
      this.block.dataset.intersectionRatio = 0.8;
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
    this.textRows.forEach((row, i) => {
      row.style.transition = `none`;
    });
    this.block.classList.remove("animated-text--out-top");
    this.textRows.forEach((row, i) => {
      row.style.transition = null;
    });

    this.hiding = false;
    const observer = getObserver();
    observer.unregister(this.block);

    this.textRows.forEach((row, i) => {
      row.style.transitionDelay = `${0.08 * i}s`;
    });
    this.block.classList.add("animated-text--in-view");
  };

  hide = () => {
    this.hiding = true;

    this.textRows.forEach((row) => {
      row.style.transitionDelay = null;
    });
    this.block.classList.remove("animated-text--in-view");
  };

  hideToTop = () => {
    this.hiding = true;
    this.textRows.forEach((row) => {
      row.style.transitionDelay = null;
    });
    this.block.classList.add("animated-text--out-top");
  };

  wordsCount = (str) => {
    str = str.replace(/(^\s*)|(\s*$)/gi, "");
    str = str.replace(/[ ]{2,}/gi, " ");
    str = str.replace(/\n /, "\n");
    return str.split(" ").length;
  };

  getRow = (text) => {
    this.block.textContent = text;

    while (
      this.block.scrollWidth > this.block.offsetWidth &&
      this.wordsCount(text) > 1
    ) {
      let lastIndex = text.lastIndexOf(" ");
      text = text.substring(0, lastIndex);
      this.block.textContent = text;
    }

    const result = this.block.textContent;
    return result;
  };

  setupRows = () => {
    if (this.splitted === "true") {
      this.textRows = this.block.querySelectorAll(".animated-text__row");
      return;
    }

    this.block.style.overflow = "hidden";
    let text = this.block.textContent;
    let textRows = [];

    while (text.length > 0) {
      let newRow = this.getRow(text);
      textRows.push(newRow);
      text = text.substring(newRow.length, text.length);
    }

    this.block.innerHTML = "";
    textRows.forEach((row, i) => {
      let rowWrapper = document.createElement("span");
      rowWrapper.classList.add("animated-text__wrapper");

      let span = document.createElement("span");
      span.classList.add("animated-text__row");

      span.textContent = row;
      rowWrapper.appendChild(span);
      this.block.appendChild(rowWrapper);
    });

    this.textRows = this.block.querySelectorAll(".animated-text__row");
    this.block.style.overflow = null;
  };
}
