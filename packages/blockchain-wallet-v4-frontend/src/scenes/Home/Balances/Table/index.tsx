import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { SupportedCoinsType } from 'core/types'
import React from 'react'
import Template from './template'

type LinkStatePropsType = {
  supportedCoins: SupportedCoinsType
}
type OwnProps = {
  viewType: 'Total' | 'Wallet' | 'Hardware'
}
export type Props = OwnProps & LinkStatePropsType

class Table extends React.PureComponent<Props> {
  render () {
    const { supportedCoins, viewType } = this.props

    return <Template viewType={viewType} supportedCoins={supportedCoins} />
  }
}

const mapStateToProps = state => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Table)
