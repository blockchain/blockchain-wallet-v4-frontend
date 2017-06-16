import React from 'react'
import PropTypes from 'prop-types'

const BitcoinDisplay = (props) => {
  return (
    <span className={props.className}>{props.value}</span>
  )
}

BitcoinDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default BitcoinDisplay
