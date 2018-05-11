import React from 'react'
import { connect } from 'react-redux'

import SelectAccounts from './template.js'

class SelectAccountsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    // TODO: Store form data in the state
  }

  render () {
    return <SelectAccounts {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccountsContainer)
