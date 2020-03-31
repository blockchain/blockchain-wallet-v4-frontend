import { connect } from 'react-redux'
import { getData } from './selectors'
import BalancesTable from './template'
import React from 'react'

type LinkStatePropsType = {
  currentTab: 'total' | 'wallet' | 'lockbox'
  isSilverOrAbove: boolean
}

class BalancesTableContainer extends React.PureComponent<LinkStatePropsType> {
  render () {
    const { currentTab, isSilverOrAbove } = this.props
    return (
      <BalancesTable
        currentTab={currentTab}
        isSilverOrAbove={isSilverOrAbove}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(BalancesTableContainer)
