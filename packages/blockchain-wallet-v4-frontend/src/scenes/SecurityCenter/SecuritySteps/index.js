import React from 'react'

import SecuritySteps from './template.js'

class SecurityStepsContainer extends React.PureComponent {
  render () {
    const { data } = this.props
    return (
      <SecuritySteps
        emailVerified={data.emailVerified.getOrElse(0)}
        authType={data.authType.getOrElse(0)}
        isMnemonicVerified={data.isMnemonicVerified}
      />
    )
  }
}

export default SecurityStepsContainer
