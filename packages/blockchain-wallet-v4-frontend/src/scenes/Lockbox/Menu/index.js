import React from 'react'
import { pathOr } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { getData, getFormValues } from './selectors'
import Header from './template'

const createOption = label => ({
  label,
  value: label
})

class HeaderContainer extends React.PureComponent {
  // TODO: @header issue
  // Move this back to dashboard index page
  constructor () {
    super()
    this.onCoinSelection = this.onCoinSelection.bind(this)
  }

  onCoinSelection (newValue) {
    if (!newValue) return
    const value = pathOr([], ['search', 'value'], this.props.formValues)
    this.props.formActions.change('lockboxTransactions', 'search', {
      value: [...value, createOption(newValue)]
    })
  }

  render () {
    const {
      deviceInfo,
      btcBalance,
      bchBalance,
      ethBalance
    } = this.props.data.cata({
      Success: val => val,
      Failure: () => ({}),
      NotAsked: () => ({}),
      Loading: () => ({})
    })
    return (
      <Header
        handleCoinSelection={this.onCoinSelection}
        deviceName={deviceInfo.name}
        btcBalance={btcBalance}
        bchBalance={bchBalance}
        ethBalance={ethBalance}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  formValues: getFormValues(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.lockbox, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer)
