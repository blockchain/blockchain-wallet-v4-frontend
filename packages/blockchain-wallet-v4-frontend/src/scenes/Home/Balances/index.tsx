import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import BalancesTable from './template'
import React from 'react'

class BalancesTableContainer extends React.PureComponent<Props> {
  render () {
    const { currentTab } = this.props
    return <BalancesTable currentTab={currentTab} />
  }
}

const mapStateToProps = (state): LinkStatePropsType => getData(state)

const connector = connect(mapStateToProps)

type LinkStatePropsType = {
  currentTab: 'total' | 'wallet' | 'lockbox'
}
type Props = ConnectedProps<typeof connector>

export default connector(BalancesTableContainer)
