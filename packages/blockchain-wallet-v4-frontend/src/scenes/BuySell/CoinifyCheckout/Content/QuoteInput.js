import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  QuoteInputTemplateBuy,
  QuoteInputTemplateSell
} from './QuoteInputTemplate'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { path } from 'ramda'
import { getQuoteInputData } from './selectors'
import Loading from 'components/BuySell/Loading'

class QuoteInput extends Component {
  componentDidMount () {
    this.props.actions.initializeCheckoutForm(this.props.type)
  }

  render () {
    const {
      data,
      changeTab,
      symbol,
      setMax,
      setMin,
      checkoutError,
      increaseLimit,
      defaultCurrency,
      limits,
      disabled,
      type
    } = this.props
    return data.cata({
      Success: value => {
        const QuoteInputTemplate =
          type === 'buy' ? QuoteInputTemplateBuy : QuoteInputTemplateSell
        return (
          <QuoteInputTemplate
            val={value}
            changeTab={changeTab}
            disabled={disabled}
            unit={'__required__'}
            currency={'__required__'}
            limits={limits}
            defaultCurrency={defaultCurrency}
            symbol={symbol}
            setMax={setMax}
            setMin={setMin}
            checkoutError={checkoutError}
            increaseLimit={increaseLimit}
          />
        )
      },
      Failure: msg => <div>Failure: {msg.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <div>Not Asked</div>
    })
  }
}

QuoteInput.propTypes = {
  limits: PropTypes.object.isRequired,
  defaultCurrency: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  setMax: PropTypes.func.isRequired,
  checkoutError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
}

const mapStateToProps = (state, ownProps) => ({
  checkoutError: path(['coinify', 'checkoutError'], state),
  data: getQuoteInputData(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.modules.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuoteInput)
