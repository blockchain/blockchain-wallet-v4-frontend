import React from 'react'
import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'

class ImportedAddressesContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  render () {
    const { data, ...rest } = this.props
    return (
      data.cata({
        Success: (value) => <Success importedAddresses={value} handleClick={() => this.props.actions.showModal('ImportBtcAddress')} {...rest} />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div />,
        NotAsked: () => <div />
      })
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = (state) => ({
  data: getData(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(ImportedAddressesContainer)
