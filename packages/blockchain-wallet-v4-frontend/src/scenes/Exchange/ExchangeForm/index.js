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

const extractFieldValue = (e, value) => {
  e.preventDefault()
  return value
}

const { swapCoinAndFiat, swapBaseAndCounter } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { FIRST_STEP_SUBMIT } = model.analytics.EXCHANGE

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
    const { actions, logExchangeClick, data, showError, txError } = this.props
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
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  logExchangeClick: () =>
    dispatch(actions.analytics.logEvent(FIRST_STEP_SUBMIT)),
  actions: bindActionCreators(actions.components.exchange, dispatch),
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
