import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { SwapFormValuesType } from 'data/types'
import ExchangeForm from '../ExchangeForm'
import React from 'react'

export class ExchangeContainer extends React.PureComponent<Props> {
  componentDidMount () {
    this.props.ratesActions.fetchAvailablePairs()
  }

  componentWillUnmount () {
    this.props.actions.clearSubscriptions()
  }

  render () {
    const { from, to, fix, amount } = this.props
    return <ExchangeForm {...{ from, to, fix, amount }} />
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch),
  ratesActions: bindActionCreators(actions.modules.rates, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = SwapFormValuesType
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(ExchangeContainer)
