import React from 'react'

import SecuritySteps from './template.js'

class SecurityStepsContainer extends React.PureComponent {
  render () {
    const { data } = this.props
    return (
      <SecuritySteps emailVerified={data.emailVerified.data} authType={data.authType.data} isMnemonicVerified={data.isMnemonicVerified} />
    )
  }
}

export default SecurityStepsContainer
