import { UseTooltipHandlers } from './types'

export const useTooltipHandlers: UseTooltipHandlers = ({ hide, show }) => {
  return {
    onMouseLeave: hide,
    onMouseMove: show,
    onTouchMove: show,
    onTouchStart: show
  }
}
