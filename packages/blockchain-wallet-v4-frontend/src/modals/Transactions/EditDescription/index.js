import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import EditTxDescription from './template'

class EditTxDescriptionContainer extends React.PureComponent {
  componentDidMount() {
    this.props.formActions.initialize('editTransactionDescription', {
      description: this.props.value
    })
  }

  onSubmit = () => {
    this.props.close()
    this.props.handleConfirm(this.props.description)
  }

  render() {
    return <EditTxDescription {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  description: formValueSelector('editTransactionDescription')(state, 'description')
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('EDIT_TX_DESCRIPTION_MODAL'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(EditTxDescriptionContainer)
