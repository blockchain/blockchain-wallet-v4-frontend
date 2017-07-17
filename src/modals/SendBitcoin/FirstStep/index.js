import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import FirstStep from './template.js'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { editDisplayed: false }
    this.handleClickEdit = this.handleClickEdit.bind(this)
  }

  handleClickEdit () {
    this.setState({ editDisplayed: !this.state.editDisplayed })
  }

  render () {
    return <FirstStep {...this.props} editDisplayed={this.state.editDisplayed} handleClickEdit={this.handleClickEdit} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(FirstStepContainer)
