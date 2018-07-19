import React from 'react'

import ReactTooltip from 'react-tooltip'
import Tooltip from './template'

export const TooltipRebuild = () => ReactTooltip.rebuild()

export default class TooltipContainer extends React.PureComponent {
  render () {
    return <Tooltip {...this.props}>{this.props.children}</Tooltip>
  }
}
