import React from 'react'
import { pathOr } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData, getFormValues } from './selectors'
import Success from './template.success'
import Loading from './template.loading'
import Error from './template.error'

const createOption = label => ({
  label,
  value: label
})

class CurrencyListContainer extends React.PureComponent {
  constructor () {
    super()
    this.onRefresh = this.onRefresh.bind(this)
    this.onCoinSelection = this.onCoinSelection.bind(this)
  }

  onCoinSelection (newValue) {
    if (!newValue) return
    const value = pathOr([], ['search', 'value'], this.props.formValues)
    this.props.formActions.change('lockboxTransactions', 'search', {
      value: [...value, createOption(newValue)]
    })
  }

  onRefresh () {
    this.props.refreshActions.refreshClicked()
  }

  render () {
    const { data, deviceInfo, formValues } = this.props
    const value = pathOr([], ['search', 'value'], formValues)
    return deviceInfo
      ? data.cata({
          Success: val => (
            <Success
              data={val}
              formValues={value}
              deviceInfo={deviceInfo}
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

const mapStateToProps = state => ({
  data: getData(state),
  formValues: getFormValues(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  refreshActions: bindActionCreators(actions.components.refresh, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyListContainer)
