import "./style.css";

export default class ScrollTop {
  constructor(block, locomotiveScroll) {
    this.block = block;
    this.scroll = locomotiveScroll;

    this.block.addEventListener("click", this.onClick);
  }

  onClick = () => {
    this.scroll.scrollTo("top");
  };
}
