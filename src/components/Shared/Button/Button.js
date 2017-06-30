import React from 'react'
import PropTypes from 'prop-types'

const Button = ({ type, fullwidth, className, children, ...props }) => (
  <button className={`btn button-${type} ${fullwidth && 'full-width'} ${className}`} {...props}>
    {children}
  </button>
)

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary', 'received', 'sent', 'transferred', 'empty']),
  fullwidth: PropTypes.bool
}

export default Button
