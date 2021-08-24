import "./style.css";

export default class ImagePlaceholder {
  static selector = ".image-placeholder";

  constructor(block) {
    this.block = block;
    this.placeholder = block.querySelector(".image-placeholder__placholder");
    this.image = block.querySelector(".image-placeholder__image");

    let image = new Image();
    image.addEventListener("load", () => {
      this.block.classList.add("image-placeholder--ready");
    });
    image.src = this.image.src;
  }
}
