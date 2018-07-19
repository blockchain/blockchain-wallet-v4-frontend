import React from 'react'

import ReactTooltip from 'react-tooltip'
import Tooltip from './template'

/**
 * In use, add as few tooltip containers as possible (they can be easily reused).
 * To give a component a tooltip, add the tag data-tip.
 * After it mounts, call TooltipRebuild to register it as a trigger.
 * Consult docs for further use https://github.com/wwayne/react-tooltip#react-tooltip
 *
 * TODO:
 * Add Proptypes
 * Update all uses of previous tooltip
 * Default prop values in './template'
 */

export const TooltipRebuild = () => ReactTooltip.rebuild()

export default class TooltipContainer extends React.PureComponent {
  render () {
    return <Tooltip {...this.props}>{this.props.children}</Tooltip>
  }
}
