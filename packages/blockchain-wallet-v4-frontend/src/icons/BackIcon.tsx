import React from 'react'

const CheckBox = ({
  innerColor = '#619FF7',
  outerColor = '#619FF7'
}: {
  innerColor?: string
  outerColor?: string
}) => {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='12' cy='12' r='7' fill={`${innerColor}`} />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z'
        fill={`${outerColor}`}
      />
    </svg>
  )
}

export default CheckBox
