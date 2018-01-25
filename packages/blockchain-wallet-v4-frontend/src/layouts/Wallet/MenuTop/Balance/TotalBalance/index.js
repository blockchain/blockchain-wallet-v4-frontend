import React from 'react'
import { connect } from 'react-redux'
import { getData } from './selectors'

class TotalBalance extends React.Component {
  render () {
    const { data } = this.props
    return (
      data.cata({
        Success: (value) => <div>{value.totalFiatBalance}</div>,
        Failure: (msg) => <div>{msg}</div>,
        Loading: () => <div>loading</div>,
        NotAsked: () => <div>not asked</div>
      })
    )
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(TotalBalance)
