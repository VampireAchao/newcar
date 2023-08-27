import type { IRotatedMut } from "@newcar/objects/src/objects/carobj/interface";

import type { AnimationBuilder } from "..";
import { Interpolator } from "../interpolation/Interpolator";
import { LinearInterpolator } from "../interpolation/LinearInterpolator";
import { AnimationBuilderItem } from "../item";

export class Rotation extends AnimationBuilderItem {
  #obj: IRotatedMut;
  #interpolator: Interpolator;
  readonly #length: number;
  readonly #start: number;

  constructor(
    obj: IRotatedMut,
    data: {
      startAt?: number;
      lastsFor?: number;
      from?: number;
      to?: number;
      by?: (x: number) => number;
    },
  ) {
    super();
    if (data.to === undefined || data.lastsFor === undefined || data.startAt === undefined) {
      throw new Error("This animation is missing necessary values");
    }
    data.from = data.from ?? obj.rotation;
    this.#start = data.startAt;
    this.#obj = obj;
    this.#interpolator = new Interpolator(data.from, data.to, data.by ?? LinearInterpolator);
    this.#length = data.lastsFor;
  }

  onDrawFrame(relativeFrameCount: number, _parent: AnimationBuilder): void {
    this.#obj.rotation = this.#interpolator.interpolate((relativeFrameCount + 1) / this.#length);
  }

  get startFrame(): number {
    return this.#start;
  }

  get length(): number {
    return this.#length;
  }
}
