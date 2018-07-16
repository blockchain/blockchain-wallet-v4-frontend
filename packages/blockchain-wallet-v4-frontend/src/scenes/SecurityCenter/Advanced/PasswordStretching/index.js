import React from 'react'

import PasswordStretching from './template.js'

class PasswordStretchingContainer extends React.PureComponent {
  render () {
    return <PasswordStretching {...this.props} />
  }
}

export default PasswordStretchingContainer
