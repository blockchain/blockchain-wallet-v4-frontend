import React from 'react'
import { pathOr } from 'ramda'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import { actions } from 'data'
import { getData, getFormValues } from './selectors'
import LockboxMenu from './template'

const createOption = label => ({
  label,
  value: label
})

class LockboxMenuContainer extends React.PureComponent {
  // TODO: @lockboxmenu issue and then..
  // 1) Move this back to dashboard index page
  // 2) remove hacky name display logic in template
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
    const value = pathOr([], ['search', 'value'], this.props.formValues)
    return (
      <LockboxMenu
        handleCoinSelection={this.onCoinSelection}
        deviceInfo={deviceInfo}
        location={this.props.location}
        btcBalance={btcBalance}
        bchBalance={bchBalance}
        ethBalance={ethBalance}
        formValues={value}
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

const enhance = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)
export default enhance(LockboxMenuContainer)
