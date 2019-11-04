import { actions, model } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import EditTxDescription from './template'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

const { TRANSACTION_EVENTS } = model.analytics
class EditTxDescriptionContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('editTransactionDescription', {
      description: this.props.value
    })
  }

  onSubmit = () => {
    this.props.close()
    this.props.handleConfirm(this.props.description)
    this.props.analyticsActions.logEvent(TRANSACTION_EVENTS.EDIT_DESCRIPTION)
  }

  render () {
    return <EditTxDescription {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = state => ({
  description: formValueSelector('editTransactionDescription')(
    state,
    'description'
  )
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(
  modalEnhancer('EditTxDescription'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(EditTxDescriptionContainer)
