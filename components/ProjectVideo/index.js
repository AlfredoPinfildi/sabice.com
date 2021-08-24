import "./style.css";

export default class ProjectVideo {
  static selector = ".project__video";

  constructor(block) {
    this.block = block;
  }

  close = () => {
    this.block.classList.remove("project__video--active");
    let data = { method: "pause" };
    this.player.contentWindow.postMessage(JSON.stringify(data), "*");

    setTimeout(() => {
      this.block.parentNode.style.position = null;
      this.block.parentNode.style.zIndex = null;
    }, 400);
  };

  onPlayButtonClicked = () => {
    this.block.parentNode.style.position = "fixed";
    this.block.parentNode.style.zIndex = "999";
    this.block.classList.add("project__video--active");

    if (!this.player.src) {
      this.player.src = this.block.dataset.src;
    }

    setTimeout(() => {
      let data = { method: "play" };
      this.player.contentWindow.postMessage(JSON.stringify(data), "*");
    }, 400);
  };

  onClick = (e) => {
    const target = e.target;

    if (!this.videoPlayer.contains(target) || target !== this.videoPlayer) {
      this.close();
    }
  };

  onReady = () => {};

  onComplete = () => {
    this.mounted = true;

    this.videoPlayer = this.block.querySelector(".project__video__player");
    this.player = this.block.querySelector("iframe");
    this.closeButton = document.querySelector(".project__video__close");

    this.playButton = document.querySelector(".cursor-type--play");
    if (this.playButton) {
      this.playButton.addEventListener("click", this.onPlayButtonClicked);
    }

    this.block.addEventListener("click", this.onClick);
    this.closeButton.addEventListener("click", this.close);
  };

  onPageChangeComplete = () => {
    this.onComplete();
  };
}
