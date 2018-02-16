import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Success from './template.success'

class ArchivedAddressesContainer extends React.Component {
  render () {
    const { data, ...rest } = this.props
    console.log('render archived', this.props)
    return (
      data.cata({
        Success: (value) => <Success archivedAddresses={value} {...rest} />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(ArchivedAddressesContainer)
