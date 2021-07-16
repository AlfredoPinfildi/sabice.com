import "./style.css";
import layout from "./layout.html";
export default class Footer {
  static selector = "footer";

  constructor(block) {
    this.block = block;

    this.block.innerHTML = layout;
  }
}
