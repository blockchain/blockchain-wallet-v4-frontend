import React from 'react'

const Failure = ({user, showModal, msg}) => {
  if (!user) {
    showModal('SfoxExchangeData', 'create')
    return <span>Should be Buy/Sell Select Page</span>
  }
  return (
    <div>
      <h5>
        There was an error: {msg.message}
      </h5>
    </div>
  )
}

export default Failure
