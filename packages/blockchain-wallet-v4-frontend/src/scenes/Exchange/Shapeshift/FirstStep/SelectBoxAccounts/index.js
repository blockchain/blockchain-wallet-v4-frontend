import React from 'react'
import PropTypes from 'prop-types'

import SelectBoxAccounts from './template'
import { changeSource, changeTarget } from './services'

class SelectBoxAccountsContainer extends React.Component {
  constructor (props) {
    super(props)
    const { source, target } = this.props.input.value

    this.state = { source, target }
    this.handleSwap = this.handleSwap.bind(this)
    this.handleChangeSource = this.handleChangeSource.bind(this)
    this.handleChangeTarget = this.handleChangeTarget.bind(this)
  }

  handleSwap () {
    const newState = { source: this.state.target, target: this.state.source }
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  handleChangeSource (value) {
    const newState = changeSource(this.state.source, value, this.state.target, this.props.defaultAccounts)
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  handleChangeTarget (value) {
    const newState = changeTarget(this.state.target, value, this.state.source, this.props.defaultAccounts)
    this.setState(newState)
    this.props.input.onChange(newState)
  }

  renderComponent (loading) {
    const { data, ...rest } = this.props
    const { source, target } = this.state

    return <SelectBoxAccounts
      {...rest}
      source={source}
      target={target}
      loading={loading}
      handleSwap={this.handleSwap}
      handleChangeSource={this.handleChangeSource}
      handleChangeTarget={this.handleChangeTarget}
    />
  }

  render () {
    return this.props.data.cata({
      Success: (value) => this.renderComponent(false || this.props.loading),
      // TODO: what is the error component?
      Failure: (message) => <span>ERROR</span>,
      Loading: () => this.renderComponent(true),
      NotAsked: () => this.renderComponent(false || this.props.loading)
    })
  }
}

SelectBoxAccountsContainer.propTypes = {
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.shape({
      source: PropTypes.object,
      target: PropTypes.object
    })
  }),
  elements: PropTypes.array.isRequired,
  defaultAccounts: PropTypes.shape({
    BTC: PropTypes.object.isRequired,
    ETH: PropTypes.object.isRequired,
    BCH: PropTypes.object.isRequired
  }).isRequired
}

export default SelectBoxAccountsContainer
