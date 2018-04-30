import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeHistoryContainer extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: (value) => <Success complete={value.complete} incomplete={value.incomplete} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(ExchangeHistoryContainer)
