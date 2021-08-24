import "./style.css";
import layout from "./layout.html";

import works from "@data/works";
import mod from "@utils/mod";

export default class NextProject {
  static selector = ".next-project";

  constructor(block) {
    this.block = block;
    this.block.innerHTML = layout;
    this.itemsNode = block.querySelector(".next-project__items");
    this.itemTemplate = block.querySelector("#next-project__item");
    this.arrows = block.querySelectorAll(".next-project__arrow");
    this.carouselNode = block.querySelector(".next-project__carousel");
    this.itemsWrapperNode = block.querySelector(".next-project__items-wrapper");

    this.current = block.dataset.current;
    this.excluded = block.dataset.exclude;

    this.x0 = 0;
    this.x = 0;
    this.dX = 0;
    this.y0 = 0;
    this.y = 0;
    this.dY = 0;
    this.tX = 0;
    this.tX0 = 0;

    this.itemsNode.addEventListener("touchstart", this.onTouchStart);
    this.itemsNode.addEventListener("touchmove", this.onTouchMove, {
      passive: false,
    });
    this.itemsNode.addEventListener("touchend", this.onTouchEnd);
  }

  setItemWidth = () => {
    if (this.itemNodes) {
      this.itemWidth = this.itemNodes[0].getBoundingClientRect().width;
    }
  };

  onResize = () => {
    this.itemNodesTitles.forEach((title) => {
      title.textContent = title.dataset.large;
      if (title.scrollWidth > title.offsetWidth) {
        title.textContent = title.dataset.medium;

        if (title.scrollWidth > title.offsetWidth) {
          title.textContent = title.dataset.small;
        }
      }
    });

    this.setItemWidth();
    this.updateItemsPosition();
  };

  onComplete = () => {
    this.mounted = true;

    this.setupItems();

    window.setTimeout(() => {
      this.onResize();
    }, 200);

    this.arrows.forEach((arrow) => {
      arrow.addEventListener("click", this.onArrowClicked);
    });
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };

  onReady = () => {
    this.works = works.filter(this.exclude);
    this.index = this.getCurrentIndex() + 2;
  };

  exclude = (work) => {
    return work.slug !== this.excluded;
  };

  getCurrentIndex = () => {
    for (let i = 0; i < this.works.length; i++) {
      if (this.works[i].slug === this.current) {
        return i;
      }
    }

    return 0;
  };

  setupItems = () => {
    this.works.forEach((work) => {
      const itemNode = this.setupItem(work);

      if (itemNode) {
        this.itemsNode.appendChild(itemNode);
      }
    });

    this.cloneItems();
  };

  setupItem = (work) => {
    let itemNode = this.itemTemplate.content.querySelector(
      ".next-project__item"
    );

    let itemTextNodeWrapper = this.itemTemplate.content.querySelector(
      ".next-project__item h2"
    );

    let itemTextNode = this.itemTemplate.content.querySelector(
      ".next-project__item h2 span"
    );

    if (itemNode) {
      itemTextNode.textContent = work.name.large;
      itemTextNodeWrapper.dataset.small = work.name.small;
      itemTextNodeWrapper.dataset.medium = work.name.medium;
      itemTextNodeWrapper.dataset.large = work.name.large;
      itemNode.href = `/lavori/${work.slug}`;

      return document.importNode(this.itemTemplate.content, true);
    } else {
      return null;
    }
  };

  cloneItems = () => {
    this.itemNodes = this.block.querySelectorAll(".next-project__item-wrapper");

    const firstItem = this.itemNodes[0];
    const firstClone = firstItem.cloneNode(true);

    const secondItem = this.itemNodes[0];
    const secondClone = secondItem.cloneNode(true);

    const lastItem = this.itemNodes[this.itemNodes.length - 1];
    const lastClone = lastItem.cloneNode(true);

    const penultimateItem = this.itemNodes[this.itemNodes.length - 2];
    const penultimateClone = penultimateItem.cloneNode(true);

    this.itemsNode.appendChild(firstClone);
    this.itemsNode.appendChild(secondClone);
    this.itemsNode.insertBefore(penultimateClone, firstItem);
    this.itemsNode.insertBefore(lastClone, firstItem);

    this.itemNodes = this.block.querySelectorAll(".next-project__item-wrapper");
    this.itemNodesTitles = this.block.querySelectorAll(
      ".next-project__item-wrapper h2"
    );

    window.App.initClones();
  };

  onTouchStart = (e) => {
    if (this.isIndexChanging || window.App.getIsPageChanging()) {
      return;
    }

    this.x0 = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    this.y0 = (e.touches && e.touches[0] && e.touches[0].clientY) || e.clientY;
    this.itemsNode.style.transition = "none";
  };

  onTouchMove = (e) => {
    if (!this.x0 || this.isIndexChanging || window.App.getIsPageChanging()) {
      return;
    }

    this.x = (e.touches && e.touches[0] && e.touches[0].clientX) || e.clientX;
    this.y = (e.touches && e.touches[0] && e.touches[0].clientY) || e.clientY;

    this.dX = this.x - this.x0;
    this.dY = this.y - this.y0;
    this.tX = this.tX0 - this.dX;

    if (Math.abs(this.dX) > Math.abs(this.dY)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    this.itemsNode.style.transform = `translateX(-${this.tX}px)`;
  };

  onTouchEnd = (e) => {
    this.itemsNode.style.transition = null;

    if (
      !this.x0 ||
      !this.x ||
      this.isIndexChanging ||
      window.App.getIsPageChanging()
    ) {
      this.x = null;
      this.x0 = null;

      return;
    }

    const newIndex = this.tX > this.tX0 ? this.index + 1 : this.index - 1;

    this.updateIndex(newIndex);

    this.x = null;
    this.x0 = null;
  };

  onArrowClicked = (e) => {
    if (this.isIndexChanging) {
      return;
    }
    const operator = e.currentTarget.dataset.operator;

    let newIndex = operator === "+" ? this.index + 1 : this.index - 1;
    this.updateIndex(mod(newIndex, this.itemNodes.length));
  };

  updateIndex = (newIndex) => {
    this.index = newIndex;
    this.updateItemsPosition();
  };

  updateItemsPosition = () => {
    if (this.index === 1 || this.index === this.itemNodes.length - 2) {
      this.isIndexChanging = true;
      this.itemsNode.addEventListener(
        "transitionend",
        this.onItemsNodesTransitionend
      );
    }

    const target = this.itemNodes[this.index];
    const targetLeft =
      window.innerWidth > 767 ? this.itemWidth * this.index : target.offsetLeft;
    const left = window.innerWidth / 2;
    const targetHalf = target.offsetWidth / 2;

    this.tX0 =
      targetLeft -
      left +
      targetHalf +
      this.itemsWrapperNode.offsetLeft +
      this.carouselNode.offsetLeft;

    this.itemsNode.style.transform = `translateX(-${this.tX0}px)`;

    this.itemNodes.forEach((node) => {
      node.classList.remove("next-project__item-wrapper--current");
    });

    this.itemNodes[this.index].classList.add(
      "next-project__item-wrapper--current"
    );
  };

  onItemsNodesTransitionend = () => {
    this.itemsNode.removeEventListener(
      "transitionend",
      this.onItemsNodesTransitionend
    );

    this.itemsNode.style.transition = "none";
    this.index = this.index === 1 ? this.itemNodes.length - 3 : 2;

    const target = this.itemNodes[this.index];
    const targetLeft =
      window.innerWidth > 767 ? this.itemWidth * this.index : target.offsetLeft;
    const left = window.innerWidth / 2;
    const targetHalf = target.offsetWidth / 2;

    this.tX0 =
      targetLeft -
      left +
      targetHalf +
      this.itemsWrapperNode.offsetLeft +
      this.carouselNode.offsetLeft;

    this.itemsNode.style.transform = `translateX(-${this.tX0}px)`;

    setTimeout(() => {
      this.itemsNode.style.transition = null;
      this.isIndexChanging = false;
    }, 10);
  };
}
