import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { SupportedCoinsType } from 'core/types'
import React from 'react'
import Template from './template'

class Table extends React.PureComponent<Props> {
  render () {
    return <Template {...this.props} />
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.refresh, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type LinkStatePropsType = {
  supportedCoins: SupportedCoinsType
}
type OwnProps = {
  viewType: 'Total' | 'Wallet' | 'Hardware'
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Table)
