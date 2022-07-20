import React from 'react'
import { connect } from 'react-redux'
import { getData } from 'blockchain-wallet-v4-frontend/src/components/Form/FiatConverter/selectors'

import { SkeletonRectangle } from 'blockchain-info-components'

import Converter from './Converter'

const FiatConverterContainer = (props) => {
  const {
    className,
    closeNotEnoughCoinsTooltip,
    data,
    disabled,
    errorBottom,
    input,
    marginTop,
    meta
  } = props

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => <SkeletonRectangle height='40px' width='100%' />,
    NotAsked: () => null,
    Success: (value) => {
      return (
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
          data-e2e={props['data-e2e']}
          closeNotEnoughCoinsTooltip={closeNotEnoughCoinsTooltip}
        />
      )
    }
  })
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(FiatConverterContainer)
