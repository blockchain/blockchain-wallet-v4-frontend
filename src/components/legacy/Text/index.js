import React from 'react'
import BaseText from './BaseText'
import PropTypes from 'prop-types'

const types = {
  Header: {
    size: 24,
    weight: 300
  },
  HeaderLarge: {
    size: 28,
    weight: 200
  },
  CryptoBalance: {
    size: 23,
    weight: 300
  },
  FiatBalance: {
    size: 20,
    weight: 200
  },
  DidYouKnow: {
    size: 18,
    weight: 300
  },
  Transaction: {
    size: 16,
    weight: 400
  },
  DropdownHeader: {
    size: 16,
    weight: 600
  },
  BodyCopy: {
    size: 14,
    weight: 300
  },
  Description: {
    size: 14,
    weight: 200
  },
  BalanceTableFiat: {
    size: 12,
    weight: 300
  }
}

const Text = ({ type, ...props, children }) => {
  var instance = types[type]
  var size = instance.size
  var weight = instance.weight
  return(
    <BaseText {...props} size={props.size || size} weight={props.weight || weight}>
      {children}
    </BaseText>
  )
}

Text.propTypes = {
  type: PropTypes.oneOf(Object.getOwnPropertyNames(types)).isRequired,
  size: PropTypes.number,
  weight: PropTypes.number
}

export default Text
