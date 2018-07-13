import React from 'react'
import zxcvbn from 'zxcvbn'

import { PasswordGauge } from 'blockchain-info-components'

const PasswordScore = props => {
  const score = zxcvbn(props.value).score + 1

  return <PasswordGauge score={score} />
}

export default PasswordScore
