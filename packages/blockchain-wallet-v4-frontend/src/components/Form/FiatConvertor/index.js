import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Convertor from './Convertor'

class FiatConvertorContainer extends React.PureComponent {
  render () {
    const { input, meta, data, disabled, errorBottom, className } = this.props

    return data.cata({
      Success: value => (
        <Convertor
          {...value}
          className={className}
          meta={meta}
          errorBottom={errorBottom}
          value={input.value}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          disabled={disabled}
          data-e2e={this.props['data-e2e']}
        />
      ),
      Failure: message => <Error>{message}</Error>,
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
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.number.isRequired
    ])
  }).isRequired,
  coin: PropTypes.oneOf(['BTC', 'ETH', 'BCH', 'BSV', 'XLM']).isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(FiatConvertorContainer)
