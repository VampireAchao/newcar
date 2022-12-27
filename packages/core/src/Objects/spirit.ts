import { Carobj } from './index'

export class Spirit extends Carobj {
  
  /**
   * You can set different types of status,the spirit only display one of all until you change it.
   */

  #status: HTMLImageElement[] // The status of the carobj, default by the first.
  #x: number // The X coordinate.
  #y: number // The Y coordinate .
  #statusNow: number // Current status.
  
  /**
   * Delete one of status.
   * @param index The index of the status.
   */
  deleteStatus (index: number) {
    delete this.#status[index]
  }
  
  /**
   * Set the status.
   * @param dis[0] The image of all status.
   * @param dis[1] The index of all status,Non-required.
   */
  set displayStatus (dis: [HTMLImageElement, number]) {
    if (typeof dis[1] === "undefined") {
      this.#status.push(dis[0]);
    } else {
      this.#status[dis[1]] = dis[0];
    }
  }

  #draway(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.#status[this.#statusNow],
      this.#x, this.#y
    );
    return ctx;
  }
  
  set status(value: number) {
    this.#statusNow = value;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  set x(value: number) {
    this.#x = value;
  }

  set y(value: number) {
    this.#y = value;
  }
  
  get sigh() {
    return "Spirit";
  }
}