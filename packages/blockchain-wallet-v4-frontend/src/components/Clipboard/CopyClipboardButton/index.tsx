import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import * as C from 'services/alerts'

import CopyClipboard from './template'

export interface OwnProps {
  alertActions: any
  color?: string
  onClick?: Function
  size?: string
  textToCopy: string
}

export interface State {
  active: boolean
}

class CopyToClipboardContainer extends React.PureComponent<Props, State> {
  timeout: number | undefined

  constructor(props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  handleClick() {
    const { alertActions } = this.props
    this.setState({ active: true })
    // @ts-ignore
    this.timeout = setTimeout(() => {
      this.setState({ active: false })
    }, 2000)
    alertActions.displaySuccess(C.COPY_LINK_CLIPBOARD_SUCCESS)
    if (this.props.onClick) this.props.onClick()
  }

  render() {
    return (
      <CopyClipboard
        active={this.state.active}
        color={this.props.color}
        handleClick={this.handleClick}
        data-e2e={this.props['data-e2e']}
        textToCopy={this.props.textToCopy}
        size={this.props.size}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CopyToClipboardContainer)
