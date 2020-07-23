import * as C from 'services/AlertService'
import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import CopyClipboard from './template'
import React from 'react'

export interface OwnProps {
  address: string
  alertActions: any
}

export interface State {
  active: boolean
}

class CopyToClipboardContainer extends React.PureComponent<Props, State> {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }
  timeout: number | undefined

  handleClick () {
    const { alertActions } = this.props
    this.setState({ active: true })
    this.timeout = setTimeout(() => {
      this.setState({ active: false })
    }, 2000)
    alertActions.displaySuccess(C.COPY_LINK_CLIPBOARD_SUCCESS)
  }

  render () {
    return (
      <CopyClipboard
        active={this.state.active}
        address={this.props.address}
        handleClick={this.handleClick}
        data-e2e={this.props['data-e2e']}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CopyToClipboardContainer)
