import React from 'react'
import { connect } from 'react-redux'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { getData } from './selectors'

class WalletLanguageContainer extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest} language={value} />,
      Failure: (message) => <Error {...rest} message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(WalletLanguageContainer)
