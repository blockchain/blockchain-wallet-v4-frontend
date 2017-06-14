import React from 'react'
import PropTypes from 'prop-types'

const CurrencyDisplay = (props) => {
  return (
    <span className={props.className}>{props.value}</span>
  )
}

CurrencyDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default CurrencyDisplay
