import React from 'react'

import DataError from 'components/DataError'
import Loading from './template.loading'
import Success from './template.success'

class Pages extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  handleRefresh () {
    this.props.actions.initialized()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success transactions={value} />,
      Failure: () => <DataError onClick={() => this.handleRefresh()} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

export default Pages
