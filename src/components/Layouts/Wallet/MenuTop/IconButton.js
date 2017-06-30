import React from 'react'

const IconButton = ({ icon, className = '', click, children }) => (
  <button className={`button-empty ${className}`} onClick={click}>
    <i className={children ? `margin-right-5 ${icon}` : icon} />
    {children}
  </button>
)

export default IconButton
