import { defineAnimation } from '@newcar/core'
import { Circle } from '../widgets'
import { scale } from './scale'
import { fadeIn } from './fadeIn'
import { fadeOut } from './fadeOut'

export const circleIndicate = defineAnimation({
  act(_widget, _elapsed, _process, _duration, _ck, _params) {
    this.circle.show()
  },

  init(widget, startAt, duration, _ck, params: {
    scale: number
  }) {
    this.circle = new Circle(
      Math.sqrt(((widget.singleRange[2] - widget.singleRange[0]) / 2) ** 2
      + ((widget.singleRange[3] - widget.singleRange[1]) / 2) ** 2),
      {
        style: {
          fill: false,
          border: true,
        },
      },
    )
    this.circle.animate(
      fadeIn,
      startAt,
      duration / 2,
    )
    this.circle.animate(
      fadeOut,
      startAt + duration / 2 + duration / 3,
      duration / 2,
    )
    if (params.scale) {
      this.circle.animate(
        scale,
        startAt,
        duration / 2,
        {
          from: [params.scale, params.scale],
          to: [1, 1],
        },
      )
      this.circle.animate(
        scale,
        startAt + duration / 2 + duration / 3,
        duration / 2,
        {
          to: [params.scale, params.scale],
          mode: 'reverse',
        },
      )
    }
    this.circle.hide()
    widget.add(this.circle)
  },
})