import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors.js'
import Success from './template.success.js'
import Loading from '../../../../template.loading'

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
    const { data } = this.props
    return data.cata({
      Success: (value) => <Success onSubmit={this.onSubmit} {...value} />,
      Failure: (message) => <div>Failure: {message.error}</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectAccountsContainer)
