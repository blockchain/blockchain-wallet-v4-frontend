import React from 'react'
import Button from './Button'

const IconButton = ({ icon, children, ...props }) => (
  <Button type='empty' {...props}>
    <i className={children ? `margin-right-5 ${icon}` : icon} />
    {children}
  </Button>
)

export default IconButton
