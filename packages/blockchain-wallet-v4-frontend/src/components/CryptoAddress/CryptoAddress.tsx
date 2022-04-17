import React from 'react'

const CryptoAddress = ({ children }) => {
  if (!children) return null

  return (
    <>
      {children.slice(0, 5)}...
      {children.slice(children.length - 5, children.length)}
    </>
  )
}

export default CryptoAddress
