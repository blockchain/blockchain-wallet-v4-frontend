import React from 'react'

const Success = (props) => {
  const { wallets } = props
  return (
    wallets.map((wallet, i) => {
      return (
        <div key={i}>
          <div>{ wallet.label }</div>
          <div>{ wallet.value.balance }</div>
        </div>
      )
    })
  )
}

export default Success
