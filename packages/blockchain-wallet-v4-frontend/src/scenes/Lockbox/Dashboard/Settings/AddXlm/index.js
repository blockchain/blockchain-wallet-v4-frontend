import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

import AddXlm from './template.js'

class AddXlmContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onAddClick = this.onAddClick.bind(this)
  }

  onAddClick () {
    const deviceIndex = this.props.deviceIndex
    this.props.lockboxActions.addXlm(deviceIndex)
  }

  render () {
    return (
      <AddXlm
        onAddClick={this.onAddClick}
        isBrowserChrome={this.props.isBrowserChrome}
      />
    )
  }
}

AddXlmContainer.propTypes = {
  isBrowserChrome: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(AddXlmContainer)
