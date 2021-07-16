import "./style.css";
import clamp from "@utils/clamp";
import { easeOutQuint } from "@utils/easing";
import { getRaf } from "@app";

export default class StrokeText {
  static selector = ".stroke-text";

  constructor(block) {
    this.block = block;

    this.block.addEventListener("mousedown", this.onMouseDown);
    this.block.addEventListener("mouseup", this.onMouseUp);

    this.fillAnimation = {
      duration: 1600,
      progress: 0,
      styles: {
        backgroundSizeX: {
          fromValue: 0,
          toValue: 100,
          current: 0,
          setValue: (progress) => {
            return this.down
              ? this.fillAnimation.styles.backgroundSizeX.toValue * progress
              : this.fillAnimation.styles.backgroundSizeX.fromValue *
                  (1 - progress);
          },
        },
      },
    };
  }

  animateFill = (timestamp) => {
    if (!this.fillAnimation.startTimestamp) {
      this.fillAnimation.startTimestamp = timestamp;
    }

    const progress = easeOutQuint(
      clamp(
        (timestamp - this.fillAnimation.startTimestamp) /
          this.fillAnimation.duration,
        0,
        1
      )
    );

    for (const key in this.fillAnimation.styles) {
      this.fillAnimation.styles[key].current =
        this.fillAnimation.styles[key].setValue(progress);
    }

    this.animateFillStyles();
  };

  animateFillStyles = () => {
    this.block.style.backgroundSize = `${this.fillAnimation.styles.backgroundSizeX.current}% 100%`;
  };

  onMouseDown = (e) => {
    this.down = true;
    this.fillAnimation.startTimestamp = null;

    const raf = getRaf();
    raf.register(this.block.dataset.instanceIndex, this.animateFill);
  };

  onMouseUp = (e) => {
    this.down = false;
    this.fillAnimation.startTimestamp = null;

    this.fillAnimation.styles.backgroundSizeX.fromValue =
      this.fillAnimation.styles.backgroundSizeX.current;
  };
}
