import React from 'react'
import PropTypes from 'prop-types'

const CircleButton = ({ type, fullwidth, className, children, ...props }) => (
  <button className={`btn button-${type} round ${fullwidth && 'full-width'} ${className}`} {...props}>
    {children}
  </button>
)

CircleButton.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary', 'received', 'sent', 'transferred', 'empty']),
  fullwidth: PropTypes.bool
}

export default CircleButton
