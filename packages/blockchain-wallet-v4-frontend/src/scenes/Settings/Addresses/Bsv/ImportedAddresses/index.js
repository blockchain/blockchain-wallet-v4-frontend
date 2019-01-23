import React from 'react'
import { actions, model } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import ImportedAddresses from './template'
import { formValueSelector } from 'redux-form'
import { Remote } from 'blockchain-wallet-v4/src'

class ImportedAddressesContainer extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Remote.Loading.is(nextProps.data)
  }

  handleTransferAll = () => {
    this.props.actions.showModal(model.components.sendBsv.MODAL, {
      from: 'allImportedAddresses',
      excludeHDWallets: true
    })
  }

  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: addresses => {
        return addresses.length ? (
          <ImportedAddresses
            importedAddresses={addresses}
            onTransferAll={this.handleTransferAll}
            {...rest}
          />
        ) : (
          <div />
        )
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = state => ({
  data: getData(state),
  search: formValueSelector('settingsAddresses')(state, 'search')
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportedAddressesContainer)
