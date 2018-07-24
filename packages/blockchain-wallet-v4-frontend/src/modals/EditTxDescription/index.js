import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import { formValueSelector } from 'redux-form'
import modalEnhancer from 'providers/ModalEnhancer'
import EditTxDescription from './template.js'

class EditTxDescriptionContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount () {
    this.props.formActions.initialize('editTransactionDescription', { description: this.props.value })
  }

  onSubmit () {
    this.props.close()
    this.props.handleConfirm(this.props.description)
  }

  render () {
    return <EditTxDescription {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
  description: formValueSelector('editTransactionDescription')(state, 'description')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.settings, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps), modalEnhancer('EditTxDescription'))

export default enhance(EditTxDescriptionContainer)
