import React from 'react'
import { connect } from 'react-redux'

import Loading from 'components/BuySell/Loading'
import { getData } from './selectors'
import AddBankDetails from './template.js'

class AddBankDetailsContainer extends React.PureComponent {
  render () {
    const { data } = this.props
    console.log(data)
    return data.cata({
      Success: (value) => <AddBankDetails quote={value} />,
      Loading: <Loading />,
      NotAsked: <div>Not Asked</div>,
      Failure: (error) => <div>Failure: {error && error.message}</div>
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps)(AddBankDetailsContainer)
