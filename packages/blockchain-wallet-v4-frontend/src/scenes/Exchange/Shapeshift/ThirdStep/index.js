import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ThirdStep extends React.Component {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success trade={value} {...rest} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(ThirdStep)
