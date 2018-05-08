import React from 'react'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class List extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success transactions={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default List
