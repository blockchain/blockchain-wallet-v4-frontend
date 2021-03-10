import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import EditDescription from './template'

class EditDescriptionContainer extends React.PureComponent<Props> {
  state = { newDescription: this.props.description }

  handleConfirm = desc => {
    const { handleEditDescription } = this.props
    this.setState({ newDescription: desc })
    handleEditDescription(desc)
  }

  handleChange = () => {
    this.props.modalActions.showModal('EditTxDescription', {
      origin: 'TransactionList',
      handleConfirm: this.handleConfirm,
      value: this.state.newDescription
    })
  }

  render() {
    const { newDescription } = this.state

    return (
      <EditDescription
        value={newDescription}
        handleChange={this.handleChange}
      />
    )
  }
}

type OwnProps = {
  description?: string
  handleEditDescription: (value?: string) => void
}
const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(null, mapDispatchToProps)(EditDescriptionContainer)
