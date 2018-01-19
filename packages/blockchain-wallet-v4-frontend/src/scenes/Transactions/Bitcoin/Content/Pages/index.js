import React from 'react'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class Pages extends React.Component {
  render () {
    const { data } = this.props
    console.log(data)

    return data.cata({
      Success: (value) => <Success transactions={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages
