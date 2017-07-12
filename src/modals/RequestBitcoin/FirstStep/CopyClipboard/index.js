import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import CopyClipboard from './template.js'

class CopyClipboardContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ active: true })
    setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    return (
      <CopyClipboard
        active={this.state.active}
        nextAddress={this.props.nextAddress}
        handleClick={this.handleClick}
        handleClickCode={this.props.handleClickCode}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(undefined, mapDispatchToProps)(CopyClipboardContainer)
