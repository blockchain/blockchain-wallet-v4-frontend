import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

import { actions } from 'data'
import { singleForm } from 'components/providers/FormProvider'
import modalEnhancer from 'components/providers/ModalEnhancer'
import SecondPassword from './template.js'

class SecondPasswordContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { secondPassword, handleConfirm } = this.props
    handleConfirm(secondPassword)
    // We reset the form
    this.props.reduxFormActions.reset('secondPassword')
    // We close the modal
    this.props.modalActions.closeModal()
  }

  render () {
    return <SecondPassword {...this.props} handleClick={this.handleClick} />
  }
}

SecondPasswordContainer.propTypes = {
  handleConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const selector = formValueSelector('secondPassword')
  return {
    secondPassword: selector(state, 'secondPassword')
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  singleForm('secondPassword'),
  modalEnhancer('SecondPassword'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SecondPasswordContainer)
