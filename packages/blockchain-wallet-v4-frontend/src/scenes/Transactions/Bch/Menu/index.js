import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Menu from './template.js'
import { getData } from '../../../../components/Form/SelectBoxBitcoinAddresses/selectors'

class MenuContainer extends React.PureComponent {
  render () {
    return this.props.data.cata({
      Success: (value) => <Menu accounts={value.data} handleClickReporting={() => this.props.actions.reportClicked()} />,
      Failure: (message) => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state, 'BCH')
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.bchTransactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
