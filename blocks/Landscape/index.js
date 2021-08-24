import "./style.css";
import layout from "./layout.html";

export default class Landscape {
  static selector = ".landscape";

  constructor(block) {
    this.block = block;

    this.block.innerHTML = layout;
  }
}
