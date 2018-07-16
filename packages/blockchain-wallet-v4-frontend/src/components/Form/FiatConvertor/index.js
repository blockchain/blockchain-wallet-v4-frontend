import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Convertor from './Convertor'

class FiatConvertorContainer extends React.PureComponent {
  render () {
    const { input, meta, data, disabled } = this.props

    return data.cata({
      Success: (value) => <Convertor
        unit={value.unit}
        currency={value.currency}
        btcRates={value.btcRates}
        bchRates={value.bchRates}
        ethRates={value.ethRates}
        meta={meta}
        value={input.value}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        disabled={disabled}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

FiatConvertorContainer.propTypes = {
  input: PropTypes.shape({
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired])
  }).isRequired,
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(FiatConvertorContainer)
