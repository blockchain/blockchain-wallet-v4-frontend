import React from 'react'
import Button from './Button'

const IconButton = ({ icon, className, children, ...props }) => (
  <Button type='default' className={`${children ? 'button-short-wide' : 'button-short'} ${className || ''}`} {...props}>
    <i className={`${children ? 'mr-5' : 'mhs'} ${icon}`} />
    {children}
  </Button>
)

export default IconButton
