import React from 'react'

const IconButton = ({ icon, className = '', children }) => (
  <button className={`button-empty ${className}`}>
    <i className={children ? `margin-right-5 ${icon}` : icon} />
    {children}
  </button>
)

export default IconButton
