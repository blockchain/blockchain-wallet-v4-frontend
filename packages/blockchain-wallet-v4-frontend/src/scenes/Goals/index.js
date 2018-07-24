import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startsWith, prop } from 'ramda'
import base64 from 'base-64'
import bip21 from 'bip21'
import { actions } from 'data'

import Actions from './template.js'

class ActionsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { error: '' }
  }

  componentWillMount () {
    const { payload } = this.props.match.params
    try {
      if (startsWith('bitcoin', payload)) {
        // Special case to handle bitcoin bip21 link integration
        const decodedPayload = decodeURIComponent(payload)
        const bip21Payload = bip21.decode(decodedPayload)
        const { address } = bip21Payload
        const { amount, label } = bip21Payload.options || {}
        const data = { address, amount, message: label }
        this.props.goalsActions.saveGoal('payment', data)
      } else {
        // Other scenarios with actions encoded in base64
        const decoded = JSON.parse(base64.decode(payload))
        if (!prop('name', decoded) || !prop('data', decoded)) throw new Error()
        const { name, data } = decoded
        this.props.goalsActions.saveGoal(name, data)
      }
      this.props.routerActions.push('/wallet')
    } catch (e) {
      this.setState({ error: 'invalid_link' })
    }
  }

  render () {
    return <Actions error={this.state.error} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  goalsActions: bindActionCreators(actions.goals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ActionsContainer)
