import React from 'react'

import { PasswordGauge } from 'blockchain-info-components'

const PasswordScore = props => {
  return <PasswordGauge score={props.passwordScore} />
}

export default PasswordScore
