import React from 'react'
import { connect } from 'react-redux'

import { SkeletonRectangle } from 'blockchain-info-components'

import Converter from './Converter'
import { getData } from './selectors'
import Loading from './template.loading'

class FiatConverterContainer extends React.PureComponent {
  render() {
    const { className, data, disabled, errorBottom, input, marginTop, meta } = this.props

    return data.cata({
      Failure: () => <SkeletonRectangle height='40px' width='100%' />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Converter
          {...value}
          className={className}
          meta={meta}
          errorBottom={errorBottom}
          value={input.value}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          disabled={disabled}
          marginTop={marginTop}
          data-e2e={this.props['data-e2e']}
        />
      )
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(FiatConverterContainer)
