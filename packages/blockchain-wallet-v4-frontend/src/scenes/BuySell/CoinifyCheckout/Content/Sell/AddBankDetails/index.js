import React from 'react'

import AddBankDetails from './template.js'

class AddBankDetailsContainer extends React.PureComponent {
  render () {
    return <AddBankDetails {...this.props} />
  }
}

export default AddBankDetailsContainer
