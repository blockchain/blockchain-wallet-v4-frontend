import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Menu from './template.js'
import { getData } from '../../../../components/Form/SelectBoxBitcoinAddresses/selectors'

class MenuContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClickReporting = this.handleClickReporting.bind(this)
  }

  handleClickReporting () {
    this.props.modalActions.showModal('TransactionReport', {coin: 'BCH'})
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => {
        return <Menu accounts={value.data} handleClickReporting={this.handleClickReporting} />
      },
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
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
