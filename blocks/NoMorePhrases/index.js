import "./style.css";

import data from "./data";

import clamp from "@utils/clamp";
import { getRaf } from "@app";

import layout from "./layout.html";

export default class NoMorePhrases {
  static selector = ".no-mo-phrases";

  constructor(block) {
    this.block = block;
    this.showDuration = 400;

    this.block.innerHTML = layout;
  }

  onMouseMove = (e) => {
    if (e.target !== this.logo) {
      this.header.style.zIndex = null;
      this.block.classList.remove("no-mo-phrases--visible");
      this.animationStartTimestamp = null;
      this.h2.style.opacity = null;

      this.index = this.getRandomInt(0, data.length);
      this.updateContent(this.index);
    }
  };

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
  };

  updateContent = (index) => {
    this.block.style.backgroundColor = data[this.index].background;
    this.block.style.color = data[this.index].color;
    this.h2.innerHTML = data[index].text;
  };

  updateCounter = (index) => {
    this.counters.forEach((counter) => {
      counter.style.webkitTextStrokeColor = data[this.index].color;
      counter.textContent = `${index + 1}/20`;
    });
  };

  render = (timestamp) => {
    if (!this.animationStartTimestamp) {
      this.animationStartTimestamp = timestamp;
    }

    const progress = clamp(
      (timestamp - this.animationStartTimestamp) / this.showDuration,
      0,
      1
    );

    const index = this.getRandomInt(0, data.length);
    this.updateCounter(index);
    this.updateContent(index);

    if (progress >= 1) {
      const raf = getRaf();
      raf.unregister(this.block.dataset.instanceIndex);

      this.animationStartTimestamp = null;
      this.updateCounter(this.index);
      this.updateContent(this.index);
    }
  };

  show = () => {
    this.block.classList.add("no-mo-phrases--visible");

    const raf = getRaf();
    raf.register(this.block.dataset.instanceIndex, this.render);
  };

  onPageChangeComplete = () => {
    this.block.innerHTML = layout;

    this.onComplete();
  };

  onComplete = () => {
    this.header = document.querySelector("header");
    this.logo = this.block.querySelector(".no-mo-phrases__header__logo");
    this.h2 = this.block.querySelector("h2");
    this.counters = this.block.querySelectorAll(".no-mo-phrases__counter");

    this.block.removeEventListener("mousemove", this.onMouseMove);
    this.block.addEventListener("mousemove", this.onMouseMove);

    this.index = this.getRandomInt(0, data.length);
    this.updateContent(this.index);
  };
}
