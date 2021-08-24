export default class ProjectHero {
  static selector = ".project__hero";

  constructor(block) {
    this.block = block;
    this.projectCover = block.querySelector(".project__image");

    this.onReady = this.onReady.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  onResize = () => {
    if (window.innerWidth < 1024) {
      this.block.style.height = null;
      return;
    }

    this.block.style.height = null;

    this.block.style.height = `${Math.max(
      this.projectCover.offsetTop + this.projectCover.offsetHeight,
      this.block.scrollHeight
    )}px`;
  };

  onReady = () => {
    this.mounted = true;
    this.onResize();
  };
}
