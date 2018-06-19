import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { reduxForm, formValueSelector } from 'redux-form'
import Template from './template'
import { path } from 'ramda'

class SfoxEnterMicroDeposits extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.props.sfoxActions.sfoxNotAsked()
  }

  handleSubmit (e) {
    const deposits = { amount1: parseFloat(this.props.deposit1), amount2: parseFloat(this.props.deposit2) }
    this.props.sfoxActions.submitMicroDeposits(deposits)
  }

  render () {
    const status = this.props.status.cata({ Success: () => 'success', Failure: (err) => err, Loading: () => 'loading', NotAsked: () => false })

    return (
      <Template
        {...this.props}
        handleSubmit={this.handleSubmit}
        status={status}
        tryAgain={() => this.props.sfoxActions.sfoxNotAsked()}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  deposit1: formValueSelector('sfoxMicroDeposits')(state, 'deposit1'),
  deposit2: formValueSelector('sfoxMicroDeposits')(state, 'deposit2'),
  status: path(['sfoxSignup', 'sfoxBusy'], state)
})

const mapDispatchToProps = (dispatch) => ({
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxEnterMicroDeposits'),
  connect(mapStateToProps, mapDispatchToProps)
)

// component export style pulled from a redux-form issue on github for an asyncValidate error on blur
// https://github.com/erikras/redux-form/issues/2420
let FormContainer = enhance(SfoxEnterMicroDeposits)
FormContainer = reduxForm({
  form: 'sfoxMicroDeposits',
  asyncBlurFields: []
})(FormContainer)
export default FormContainer
