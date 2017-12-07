import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import ListItem from './template.js'

class ListItemContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.handleToggle = this.handleToggle.bind(this)
    this.handleCoinDisplay = this.handleCoinDisplay.bind(this)
  }

  handleToggle () {
    this.setState({ toggled: !this.state.toggled })
  }

  handleCoinDisplay () {
    this.props.actions.toggleCoinDisplayed()
  }

  render () {
    return <ListItem toggled={this.state.toggled} handleToggle={this.handleToggle} handleClick={this.handleCoinDisplay} {...this.props} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ListItemContainer)
