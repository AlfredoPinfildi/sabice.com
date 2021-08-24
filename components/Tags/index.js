import "./style.css";

import worksCategories from "@data/worksCategories.js";

export default class Tags {
  static selector = ".tags";

  constructor(block) {
    this.block = block;
    this.tagTemplate = block.querySelector("#tag-template");
    this.focus = block.querySelector(".tags__focus");

    this.index = 0;
    this.onChangeCallbacks = [];

    block.addEventListener("mouseleave", this.onMouseLeave);
  }

  onReady = () => {
    this.mounted = true;
    this.setupTags();
    this.tags = [...this.block.querySelectorAll(".tags__tag")];
    this.cloneItems();

    this.tags.forEach((tag, i) => {
      tag.dataset.index = i;
      tag.addEventListener("mouseenter", this.onTagMouseEnter);
      tag.addEventListener("click", this.onClick);
    });

    let hash = location.hash.substr(1);
    const ind = worksCategories.findIndex((element) => {
      return element.slug === hash;
    });

    this.index = ind >= 0 ? ind : 0;
    this.updateFocus(this.index);
  };

  onComplete = () => {
    this.updateFocus(this.index);
  };

  onResize = () => {
    if (window.innerWidth > 767) {
      this.removeClones();
    } else if (!this.clonesWidth) {
      this.cloneItems();
    }
  };

  setupTags = () => {
    worksCategories.forEach((category) => {
      const tagNode = this.setupTag(category);

      if (tagNode) {
        this.block.appendChild(tagNode);
      }
    });
  };

  setupTag = (category) => {
    let tagNode = this.tagTemplate.content.querySelector(".tags__tag");

    if (tagNode) {
      tagNode.textContent = category.name;
      tagNode.href = category.slug;

      return document.importNode(this.tagTemplate.content, true);
    } else {
      return null;
    }
  };

  onTagMouseEnter = (e) => {
    if (window.innerWidth < 768) {
      return;
    }
    const tag = e.currentTarget;
    this.newIndex = parseInt(tag.dataset.index);

    if (this.index !== this.newIndex) {
      this.block.classList.add("tags--hovering");
      this.tags[this.index].classList.add("tags__tag--current");
    } else {
      this.block.classList.remove("tags--hovering");
      this.tags[this.index].classList.remove("tags__tag--current");
    }
    this.updateFocus(this.newIndex);
  };

  onMouseLeave = () => {
    this.updateFocus(this.index);
    this.tags[this.index].classList.remove("tags__tag--current");
    this.block.classList.remove("tags--hovering");
  };

  onClick = (e) => {
    e.preventDefault();

    if (this.resetting) return;

    const tag = e.currentTarget;
    this.newIndex = parseInt(tag.dataset.index);

    if (this.index !== this.newIndex) {
      this.tags[this.index].classList.remove("tags__tag--current");
      this.index = this.newIndex;
      this.onChangeCallbacks.forEach((callback) => {
        callback(worksCategories[this.index % worksCategories.length].slug);
      });

      this.updateFocus(this.index);

      setTimeout(() => {
        this.block.classList.remove("tags--hovering");
      }, 400);
    }
  };

  updateFocus = (newIndex) => {
    const destinationTag = this.tags[newIndex];
    destinationTag.rect = destinationTag.getBoundingClientRect();

    this.tags.forEach((tag, i) => {
      tag.classList.remove("focused");
    });

    destinationTag.classList.add("focused");

    this.focus.style.width = `${destinationTag.rect.width + 16}px`;
    this.focus.style.transform =
      window.innerWidth > 767
        ? `translate3d(${destinationTag.offsetLeft - 6}px, -50%, 0)`
        : `translate3d(0px, -50%, 0)`;

    this.tags.forEach((tag) => {
      tag.style.transform =
        window.innerWidth < 768
          ? `translateX(-${destinationTag.offsetLeft - 6}px)`
          : null;
    });

    if (newIndex >= worksCategories.length && window.innerWidth < 768) {
      this.resetting = true;
      this.focus.addEventListener("transitionend", this.reset);
    }
  };

  reset = () => {
    this.focus.removeEventListener("transitionend", this.reset);
    this.block.classList.add("tags--no-transition");
    this.index = this.index % worksCategories.length;
    this.updateFocus(this.index);
    this.block.classList.remove("tags--no-transition");
    this.resetting = false;
  };

  registerOnChangeCallback(callback) {
    this.onChangeCallbacks.push(callback);
  }

  cloneItems = () => {
    if (window.innerWidth > 767) return;

    const itemWidth = this.tags[0].offsetWidth;
    const fitIn = Math.ceil(window.innerWidth / itemWidth);

    this.block
      .querySelectorAll(".loop__clone")
      .forEach((clone) => this.block.removeChild(clone));
    let totalClones = 0;
    let clonesWidth = 0;

    for (let i = 0; i < 3; i++) {
      this.tags.forEach((tag) => {
        const clone = tag.cloneNode(true);
        clone.classList.add("loop__clone");
        this.block.appendChild(clone);
        clone.addEventListener("mouseenter", this.onTagMouseEnter);
        clone.addEventListener("click", this.onClick);
        clonesWidth += 26 + clone.offsetWidth;
        ++totalClones;
      });
    }

    this.clonesWidth = clonesWidth;
    this.scrollWidth = this.block.scrollHeight;

    this.tags = [...this.block.querySelectorAll(".tags__tag")];
  };

  removeClones = () => {
    this.block
      .querySelectorAll(".loop__clone")
      .forEach((clone) => this.block.removeChild(clone));
    this.clonesWidth = null;
  };
}
