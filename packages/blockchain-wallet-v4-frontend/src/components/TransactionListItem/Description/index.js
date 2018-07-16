import React from 'react'
import { actions } from 'data'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import EditDescription from './template'

class EditDescriptionContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { value: props.value }
    this.handleChange = this.handleChange.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  handleConfirm (desc) {
    const { handleEditDescription } = this.props
    this.setState({ value: desc })
    handleEditDescription(desc)
  }

  handleChange (e) {
    const { value } = this.props
    this.props.modalActions.showModal('EditTxDescription', { handleConfirm: this.handleConfirm, value })
  }

  render () {
    const { value } = this.state

    return <EditDescription value={value} handleChange={this.handleChange} />
  }
}

EditDescriptionContainer.propTypes = {
  value: PropTypes.string
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(EditDescriptionContainer)
