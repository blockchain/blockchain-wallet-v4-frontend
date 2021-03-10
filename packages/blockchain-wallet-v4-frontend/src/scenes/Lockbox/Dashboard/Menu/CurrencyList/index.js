import React from 'react'
import { connect } from 'react-redux'
import { contains, map, prop } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getCoinContexts, getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const createOption = label => ({
  label,
  value: label
})

class CurrencyListContainer extends React.PureComponent {
  onCoinSelection = newValue => {
    if (!newValue) return
    if (contains(newValue, map(prop('value'), this.props.formValues))) return
    this.props.formActions.change('lockboxTransactions', 'search', {
      value: [...this.props.formValues, createOption(newValue)]
    })
  }

  onSaveCoinMD = coin => {
    this.props.lockboxActions.saveCoinMD(this.props.deviceIndex, coin)
  }

  onRefresh = () => {
    this.props.refreshActions.refreshClicked()
  }

  render() {
    const { coinContexts, data, deviceInfo, formValues } = this.props

    return deviceInfo
      ? data.cata({
          Success: val => (
            <Success
              data={val}
              formValues={formValues}
              deviceInfo={deviceInfo}
              coinContexts={coinContexts}
              handleSaveCoinMD={this.onSaveCoinMD}
              handleCoinSelection={this.onCoinSelection}
            />
          ),
          Loading: () => <Loading />,
          Failure: () => <Error handleRefresh={this.onRefresh} />,
          NotAsked: () => null
        })
      : null
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  coinContexts: getCoinContexts(state, ownProps.deviceIndex)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  lockboxActions: bindActionCreators(actions.components.lockbox, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyListContainer)
