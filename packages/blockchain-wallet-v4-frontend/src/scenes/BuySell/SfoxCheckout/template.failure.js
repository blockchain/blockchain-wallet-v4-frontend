import React from 'react'

const Failure = ({user, showModal, msg}) => (
  <div>
    {
      !user
        ? showModal('SfoxExchangeData', 'create')
        : <h5>
          There was an error: {msg.error}
        </h5>
    }
  </div>
)

export default Failure
