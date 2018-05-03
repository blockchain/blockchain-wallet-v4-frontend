import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import bip21 from 'bip21'
import { actions } from 'data'

class OpenContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { link: decodeURIComponent(props.location.pathname.split('/open/')[1]) }
  }

  componentDidMount () {
    const bip21Payload = bip21.decode(this.state.link)
    const { address } = bip21Payload
    const { amount, label } = bip21Payload.options || {}
    const data = { address, amount, message: label }
    this.props.goalsActions.saveGoal('payment', data)
    this.props.routerActions.push('/wallet')
  }

  render () {
    return null
  }
}

const mapDispatchToProps = (dispatch) => ({
  goalsActions: bindActionCreators(actions.goals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(undefined, mapDispatchToProps)(OpenContainer)
