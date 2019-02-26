import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import EditDescription from './template'
import { getDescription } from './selectors'

class EditDescriptionContainer extends React.PureComponent {
  state = { value: this.props.value }

  handleConfirm = desc => {
    const { handleEditDescription } = this.props
    this.setState({ value: desc })
    handleEditDescription(desc)
  }

  handleChange = () => {
    const { value } = this.props
    this.props.modalActions.showModal('EditTxDescription', {
      handleConfirm: this.handleConfirm,
      value
    })
  }

  render () {
    const { value } = this.props

    return <EditDescription value={value} handleChange={this.handleChange} />
  }
}

EditDescriptionContainer.propTypes = {
  value: PropTypes.string
}

const mapStateToProps = (state, ownProps) => ({
  value: getDescription(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDescriptionContainer)
