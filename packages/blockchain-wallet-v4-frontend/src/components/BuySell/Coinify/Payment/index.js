import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import { getData, getQuote } from './selectors'
import Success from './template.success'
import Loading from 'components/BuySell/Loading'
import Failure from 'components/BuySell/Failure'

class PaymentContainer extends PureComponent {
  componentDidMount () {
    const quote = this.props.quote
    if (quote) this.props.coinifyDataActions.getPaymentMediums(quote)
  }

  componentWillUnmount () {
    this.props.coinifyActions.coinifyNotAsked()
  }

  handlePaymentClick = medium => {
    this.props.coinifyActions.setMedium(medium)
  }

  render () {
    const { data, coinifyBusy } = this.props

    const busy = coinifyBusy.cata({
      Success: () => false,
      Failure: err => err,
      Loading: () => true,
      NotAsked: () => false
    })

    return data.cata({
      Success: value => (
        <Success
          value={value}
          handlePaymentClick={this.handlePaymentClick}
          busy={busy}
        />
      ),
      Failure: msg => <Failure error={msg} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

PaymentContainer.propTypes = {
  quote: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  data: getData(state),
  quote: getQuote(state).getOrElse(null),
  coinifyBusy: selectors.components.coinify.getCoinifyBusy(state)
})

const mapDispatchToProps = dispatch => ({
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  coinifyActions: bindActionCreators(actions.components.coinify, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentContainer)
