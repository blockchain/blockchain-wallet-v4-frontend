import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FiatType } from 'core/types'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

class FiatAtTime extends React.PureComponent<Props> {
  componentDidMount () {
    const { amount, hash, time, currency } = this.props
    this.props.actions.fetchFiatAtTime(hash, amount, time * 1000, currency)
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: value => <Success fiatAtTime={value} />,
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: getData(ownProps.hash, ownProps.currency, state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.btc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  amount: number
  currency: FiatType
  hash: string
  time: number
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(FiatAtTime)
