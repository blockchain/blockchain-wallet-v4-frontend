import React from 'react'
import { connect } from 'react-redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EmailAddressContainer extends React.Component {
  componentWillMount () {
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.actions.fetchSettings()
    }
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        data={value} />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(EmailAddressContainer)
