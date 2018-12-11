import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { isEmpty } from 'ramda'
import { reduxForm } from 'redux-form'

import { debounce } from 'utils/helpers'
import { actions, model } from 'data'
import { getData, canUseExchange } from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const extractFieldValue = (e, value) => value

const { swapCoinAndFiat, swapBaseAndCounter } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { FIRST_STEP_SUBMIT } = model.analytics.EXCHANGE

class ExchangeForm extends React.Component {
  componentDidMount () {
    const { canUseExchange, actions, from, to } = this.props
    if (canUseExchange) actions.initialize(from, to)
  }

  shouldComponentUpdate (nextProps) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.canUseExchange !== this.props.canUseExchange
    )
  }

  componentDidUpdate (prevProps) {
    const { canUseExchange, actions, from, to } = this.props
    if (!prevProps.canUseExchange && canUseExchange)
      actions.initialize(from, to)
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
      logExchangeClick,
      data,
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
            canUseExchange={canUseExchange}
            showError={showError}
            txError={txError}
            handleMaximum={actions.firstStepMaximumClicked}
            handleMinimum={actions.firstStepMinimumClicked}
            handleSubmit={compose(
              logExchangeClick,
              actions.showConfirmation
            )}
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
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  logExchangeClick: () =>
    dispatch(actions.analytics.logExchangeEvent(FIRST_STEP_SUBMIT)),
  actions: bindActionCreators(actions.components.exchange, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  reduxForm({
    form: EXCHANGE_FORM,
    destroyOnUnmount: false
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(ExchangeForm)
