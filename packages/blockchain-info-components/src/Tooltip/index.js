import React from 'react'

import Tooltip from './template'
export { default as TooltipHost } from './TooltipHost'
export { default as TooltipIcon } from './TooltipIcon'

/**
 * In use, add as few tooltip containers as possible (they can be easily reused).
 * To give a component a tooltip, wrap it in a TooltipHost and make the id of the host match the id of the tooltip.
 * Consult docs for further use https://github.com/wwayne/react-tooltip#react-tooltip
 *
 * TODO:
 * Add Proptypes
 * Default prop values in './template'
 */

export default class TooltipContainer extends React.PureComponent {
  render() {
    return <Tooltip {...this.props}>{this.props.children}</Tooltip>
  }
}
