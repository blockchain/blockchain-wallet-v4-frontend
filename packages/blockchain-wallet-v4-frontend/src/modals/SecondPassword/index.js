import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'

import { singleForm } from 'providers/FormProvider'
import modalEnhancer from 'providers/ModalEnhancer'
import SecondPassword from './template.js'

class SecondPasswordContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    const { secondPassword, handleConfirm } = this.props
    handleConfirm(secondPassword)
    this.props.reduxFormActions.reset('secondPassword')
    this.props.close()
  }

  render () {
    return <SecondPassword {...this.props} handleClick={this.handleClick} />
  }
}

SecondPasswordContainer.propTypes = {
  handleConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  secondPassword: formValueSelector('secondPassword')(state, 'secondPassword')
})

const mapDispatchToProps = (dispatch) => ({
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  singleForm('secondPassword'),
  modalEnhancer('SecondPassword'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(SecondPasswordContainer)
