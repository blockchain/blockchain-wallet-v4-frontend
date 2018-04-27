import React from 'react'
import { connect } from 'react-redux'
// import { compose, bindActionCreators } from 'redux'

// import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeHistoryContainer extends React.PureComponent {
  // componentWillMount () {
  //   this.props.exchangeActions.startPollingTradeStatus()
  // }

  // componentWillUnmount () {
  //   this.props.exchangeActions.stopPollingTradeStatus()
  // }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success trades={value} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state)
})

// const mapDispatchToProps = dispatch => ({
//   exchangeActions: bindActionCreators(actions.components.exchange, dispatch)
// })

// const enhance = compose(
//   connect(mapStateToProps, mapDispatchToProps)
// )

// export default enhance(ExchangeHistoryContainer)

export default connect(mapStateToProps)(ExchangeHistoryContainer)
