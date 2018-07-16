import * as AT from './actionTypes'

export const updateScroll = (xOffset, yOffset, xMax, yMax) => ({
  type: AT.UPDATE_SCROLL,
  payload: { xOffset, yOffset, xMax, yMax }
})

export const resetScroll = () => ({ type: AT.RESET_SCROLL })
