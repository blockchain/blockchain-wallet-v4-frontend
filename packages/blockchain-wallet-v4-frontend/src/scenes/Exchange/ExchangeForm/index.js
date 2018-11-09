import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, isEmpty } from 'ramda'

import { debounce } from 'utils/helpers'
import { actions, model } from 'data'
import {
  getData,
  getMin,
  getMax,
  canUseExchange,
  showError,
  getTxError
} from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const extractFieldValue = (e, value) => value

const { swapCoinAndFiat, swapBaseAndCounter } = model.rates
const { EXCHANGE_FORM } = model.components.exchange

class ExchangeForm extends React.PureComponent {
  componentDidMount () {
    const { canUseExchange, actions, from, to } = this.props
    if (canUseExchange) actions.initialize(from, to)
  }

  componentDidUpdate (prevProps) {
    const { canUseExchange, actions } = this.props
    if (!prevProps.canUseExchange && canUseExchange) actions.initialize()
  }

  componentWillUnmount () {
    this.props.actions.setShowError(false)
  }

  debounceTime = 50
  changeAmount = debounce(this.props.actions.changeAmount, this.debounceTime)

  handleRefresh = () => {
    const { actions, from, to } = this.props
    actions.initialize(from, to)
  }

  clearZero = e => {
    if (e.target.value === '0') {
      this.props.formActions.change(EXCHANGE_FORM, e.target.name, '')
    }
  }

  addZero = e => {
    if (e.target.value === '') {
      requestAnimationFrame(() =>
        this.props.formActions.change(EXCHANGE_FORM, e.target.name, '0')
      )
    }
  }

  render () {
    const {
      actions,
      formActions,
      data,
      min,
      max,
      canUseExchange,
      showError,
      txError
    } = this.props
    return data.cata({
      Success: value =>
        canUseExchange && isEmpty(value.availablePairs) ? (
          <DataError onClick={this.handleRefresh} />
        ) : (
          <Success
            {...value}
            min={min}
            max={max}
            canUseExchange={canUseExchange}
            showError={showError}
            txError={txError}
            onSubmit={actions.showConfirmation}
            handleSourceChange={compose(
              actions.changeSource,
              extractFieldValue
            )}
            handleTargetChange={compose(
              actions.changeTarget,
              extractFieldValue
            )}
            handleAmountChange={compose(
              formActions.clearSubmitErrors.bind(null, EXCHANGE_FORM),
              this.changeAmount,
              extractFieldValue
            )}
            handleInputFocus={this.clearZero}
            handleInputBlur={this.addZero}
            swapFix={compose(
              actions.changeFix,
              swapBaseAndCounter.bind(null, value.fix)
            )}
            swapCoinAndFiat={compose(
              actions.changeFix,
              swapCoinAndFiat.bind(null, value.fix)
            )}
            useMin={actions.useMin}
            useMax={actions.useMax}
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
  canUseExchange: canUseExchange(state),
  min: getMin(state),
  max: getMax(state),
  showError: showError(state),
  txError: getTxError(state),
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeForm)
