import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose, flip, prop, isEmpty } from 'ramda'

import { getRemotePropType, getElementsPropType } from 'utils/proptypes'
import { debounce } from 'utils/helpers'
import { actions, model } from 'data'
import { getData, betaFlow, canUseExchange } from './selectors'

import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'

const extractFieldValue = (e, value) => value

const { swapCoinAndFiat, swapBaseAndCounter, FIX_TYPES } = model.rates
const { BASE, COUNTER, BASE_IN_FIAT, COUNTER_IN_FIAT } = FIX_TYPES

class FirstStepContainer extends React.Component {
  componentDidMount () {
    const { canUseExchange, actions } = this.props
    if (canUseExchange) actions.initialize()
  }

  componentDidUpdate (prevProps) {
    const { canUseExchange, actions } = this.props
    if (!prevProps.canUseExchange && canUseExchange) actions.initialize()
  }

  debounceTime = 50

  handleRefresh = () => {
    this.props.actions.initialize()
  }

  getChangeAmountAction = flip(prop)({
    [BASE]: debounce(this.props.actions.changeSourceAmount, this.debounceTime),
    [COUNTER]: debounce(
      this.props.actions.changeTargetAmount,
      this.debounceTime
    ),
    [BASE_IN_FIAT]: debounce(
      this.props.actions.changeSourceFiatAmount,
      this.debounceTime
    ),
    [COUNTER_IN_FIAT]: debounce(
      this.props.actions.changeTargetFiatAmount,
      this.debounceTime
    )
  })

  render () {
    const { actions, data, betaFlow, canUseExchange } = this.props
    return data.cata({
      Success: value =>
        canUseExchange && isEmpty(value.availablePairs) ? (
          <DataError onClick={this.handleRefresh} />
        ) : (
          <Success
            {...value}
            betaFlow={betaFlow}
            canUseExchange={canUseExchange}
            handleMaximum={actions.firstStepMaximumClicked}
            handleMinimum={actions.firstStepMinimumClicked}
            onSubmit={actions.firstStepSubmitClicked}
            handleSourceChange={compose(
              actions.changeSource,
              extractFieldValue
            )}
            handleTargetChange={compose(
              actions.changeTarget,
              extractFieldValue
            )}
            handleAmountChange={compose(
              this.getChangeAmountAction(value.fix),
              extractFieldValue
            )}
            swapFix={compose(
              this.props.actions.changeFix,
              swapBaseAndCounter.bind(null, value.fix)
            )}
            swapBaseAndCounter={compose(
              this.props.actions.swapBaseAndCounter,
              swapBaseAndCounter.bind(null, value.fix)
            )}
            swapCoinAndFiat={compose(
              this.props.actions.changeFix,
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

const AccountPropType = PropTypes.shape({
  address: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  archived: PropTypes.bool.isRequired,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  coin: PropTypes.string.isRequired
})

FirstStepContainer.propTypes = {
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
  betaFlow: betaFlow(state),
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStepContainer)
