import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector, reduxForm } from 'redux-form'
import { path } from 'ramda'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import Template from './template'

class SfoxEnterMicroDeposits extends React.PureComponent {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.props.sfoxActions.sfoxNotAsked()
  }

  handleSubmit (e) {
    const deposits = {
      amount1: parseFloat(this.props.deposit1),
      amount2: parseFloat(this.props.deposit2)
    }
    this.props.sfoxActions.submitMicroDeposits(deposits)
  }

  render () {
    const status = this.props.status.cata({
      Success: () => 'success',
      Failure: err => err,
      Loading: () => 'loading',
      NotAsked: () => false
    })

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

const mapStateToProps = state => ({
  deposit1: formValueSelector('sfoxMicroDeposits')(state, 'deposit1'),
  deposit2: formValueSelector('sfoxMicroDeposits')(state, 'deposit2'),
  status: path(['sfoxSignup', 'sfoxBusy'], state),
  options: path(['walletOptionsPath'], state).getOrElse({})
})

const mapDispatchToProps = dispatch => ({
  sfoxActions: bindActionCreators(actions.modules.sfox, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxEnterMicroDeposits'),
  reduxForm({ form: 'sfoxMicroDeposits', asyncBlurFields: [] }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SfoxEnterMicroDeposits)
