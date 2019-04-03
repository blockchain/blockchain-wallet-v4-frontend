import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { isEmpty } from 'ramda'
import { reduxForm } from 'redux-form'

import { debounce } from 'utils/helpers'
import { actions, model } from 'data'
import { getData } from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { SWAP_EVENTS } from 'data/analytics/model'
const { fiatActive } = model.rates

const extractFieldValue = (e, value) => {
  return value
}

const { swapCoinAndFiat, swapBaseAndCounter } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { VALUE_INPUT } = model.analytics.SWAP_EVENTS

class ExchangeForm extends React.Component {
  componentDidMount () {
    const { actions, from, to, fix, amount } = this.props
    actions.initialize({ from, to, fix, amount })
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.data !== this.props.data
  }

  componentWillUnmount () {
    this.props.actions.setShowError(false)
  }

  debounceTime = 50
  changeAmount = debounce(this.props.actions.changeAmount, this.debounceTime)

  handleRefresh = () => {
    const { actions, from, to, fix, amount } = this.props
    actions.initialize({ from, to, fix, amount })
  }

  clearZero = (e, inputSource) => {
    if (e.target.value === '0') {
      this.props.formActions.change(EXCHANGE_FORM, e.target.name, '')
    }
    this.props.analyticsActions.logEvent([...VALUE_INPUT, inputSource])
  }

  addZero = e => {
    if (e.target.value === '') {
      requestAnimationFrame(() =>
        this.props.formActions.change(EXCHANGE_FORM, e.target.name, '0')
      )
    }
  }

  logSwapCryptoFiat = () =>
    fiatActive(this.props.fix)
      ? this.props.analyticsActions.logEvent([
          ...SWAP_EVENTS.FIAT_TO_CRYPTO_CHANGE,
          1
        ])
      : this.props.analyticsActions.logEvent([
          ...SWAP_EVENTS.CRYPTO_TO_FIAT_CHANGE,
          1
        ])

  logSwapExchnageReceive = () =>
    this.props.analyticsActions.logEvent([
      ...SWAP_EVENTS.EXCHANGE_RECEIVE_CHANGE,
      1
    ])

  render () {
    const { actions, data, showError, txError } = this.props
    return data.cata({
      Success: value =>
        isEmpty(value.availablePairs) ? (
          <DataError onClick={this.handleRefresh} />
        ) : (
          <Success
            {...value}
            showError={showError}
            txError={txError}
            handleMaximum={actions.firstStepMaximumClicked}
            handleMinimum={actions.firstStepMinimumClicked}
            handleSubmit={actions.showConfirmation}
            handleSourceChange={compose(
              actions.changeSource,
              extractFieldValue
            )}
            handleTargetChange={compose(
              actions.changeTarget,
              extractFieldValue
            )}
            handleAmountChange={compose(
              this.changeAmount,
              extractFieldValue
            )}
            handleInputFocus={e => {
              this.clearZero(e, value.inputField)
            }}
            handleInputBlur={this.addZero}
            swapFix={compose(
              this.logSwapExchnageReceive,
              actions.changeFix,
              swapBaseAndCounter.bind(null, value.fix)
            )}
            swapCoinAndFiat={compose(
              this.logSwapCryptoFiat,
              actions.changeFix,
              swapCoinAndFiat.bind(null, value.fix)
            )}
          />
        ),
      Failure: message => (
        <DataError onClick={this.handleRefresh} message={message} />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  reduxForm({
    form: EXCHANGE_FORM,
    destroyOnUnmount: false,
    persistentSubmitErrors: true
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ExchangeForm)
