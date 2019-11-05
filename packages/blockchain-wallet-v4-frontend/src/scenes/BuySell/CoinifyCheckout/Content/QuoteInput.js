import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getQuoteInputData } from './selectors'
import {
  QuoteInputTemplateBuy,
  QuoteInputTemplateSell
} from './QuoteInputTemplate'
import Loading from 'components/BuySell/Loading'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class QuoteInput extends Component {
  render () {
    const {
      data,
      checkoutError,
      defaultCurrency,
      limits,
      disabled,
      type,
      verified
    } = this.props
    return data.cata({
      Success: value => {
        const QuoteInputTemplate =
          type === 'buy' ? QuoteInputTemplateBuy : QuoteInputTemplateSell
        return (
          <QuoteInputTemplate
            val={value}
            disabled={disabled}
            limits={limits}
            defaultCurrency={defaultCurrency}
            checkoutError={checkoutError}
            verified={verified}
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

const mapStateToProps = state => ({
  checkoutError: selectors.components.coinify.getCoinifyCheckoutError(state),
  data: getQuoteInputData(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  actions: bindActionCreators(actions.components.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuoteInput)
