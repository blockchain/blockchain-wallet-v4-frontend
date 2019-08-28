import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import EditDescription from './template'

class EditDescriptionContainer extends React.PureComponent {
  state = { newDescription: this.props.description }

  handleConfirm = desc => {
    const { handleEditDescription } = this.props
    this.setState({ newDescription: desc })
    handleEditDescription(desc)
  }

  handleChange = () => {
    this.props.modalActions.showModal('EditTxDescription', {
      handleConfirm: this.handleConfirm,
      value: this.state.newDescription
    })
  }

  render () {
    const { newDescription } = this.state

    return (
      <EditDescription
        value={newDescription}
        handleChange={this.handleChange}
      />
    )
  }
}

EditDescriptionContainer.propTypes = {
  description: PropTypes.string,
  handleEditDescription: PropTypes.func.isRequired
}
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  null,
  mapDispatchToProps
)(EditDescriptionContainer)
