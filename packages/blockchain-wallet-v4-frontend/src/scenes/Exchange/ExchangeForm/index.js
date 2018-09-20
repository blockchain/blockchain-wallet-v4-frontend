import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, isEmpty } from 'ramda'

import { getRemotePropType, getElementsPropType } from 'utils/proptypes'
import { debounce } from 'utils/helpers'
import { actions, model } from 'data'
import {
  getData,
  getMin,
  getMax,
  getTargetFee,
  canUseExchange
} from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const extractFieldValue = (e, value) => value

const { swapCoinAndFiat, swapBaseAndCounter } = model.rates
const { CONFIRM } = model.components.exchange.EXCHANGE_STEPS

class ExchangeForm extends React.Component {
  componentDidMount () {
    const { canUseExchange, actions } = this.props
    if (canUseExchange) actions.initialize()
  }

  componentDidUpdate (prevProps) {
    const { canUseExchange, actions } = this.props
    if (!prevProps.canUseExchange && canUseExchange) actions.initialize()
  }

  debounceTime = 50
  changeAmount = debounce(this.props.actions.changeAmount, this.debounceTime)

  handleRefresh = () => {
    this.props.actions.initialize()
  }

  render () {
    const { actions, data, min, max, targetFee, canUseExchange } = this.props
    return data.cata({
      Success: value =>
        canUseExchange && isEmpty(value.availablePairs) ? (
          <DataError onClick={this.handleRefresh} />
        ) : (
          <Success
            {...value}
            min={min}
            max={max}
            targetFee={targetFee}
            canUseExchange={canUseExchange}
            handleMaximum={actions.firstStepMaximumClicked}
            handleMinimum={actions.firstStepMinimumClicked}
            onSubmit={actions.setStep.bind(null, CONFIRM)}
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
            swapFix={compose(
              actions.changeFix,
              swapBaseAndCounter.bind(null, value.fix)
            )}
            swapBaseAndCounter={compose(
              actions.swapBaseAndCounter,
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

const AccountPropType = PropTypes.shape({
  address: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  archived: PropTypes.bool.isRequired,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired
})

ExchangeForm.propTypes = {
  data: getRemotePropType(
    PropTypes.shape({
      availablePairs: PropTypes.arrayOf(PropTypes.string),
      fromElements: getElementsPropType(AccountPropType).isRequired,
      toElements: getElementsPropType(AccountPropType).isRequired,
      formError: PropTypes.string,
      hasOneAccount: PropTypes.bool.isRequired,
      disabled: PropTypes.bool.isRequired,
      sourceCoin: PropTypes.string.isRequired,
      targetCoin: PropTypes.string.isRequired,
      initialValues: PropTypes.shape({
        source: AccountPropType.isRequired,
        target: AccountPropType.isRequired
      }).isRequired
    })
  ).isRequired
}

const mapStateToProps = state => ({
  canUseExchange: canUseExchange(state),
  min: getMin(state),
  max: getMax(state),
  targetFee: getTargetFee(state),
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
