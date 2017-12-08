import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isNil, equals } from 'ramda'

import { actions, selectors } from 'data'
import Page from './template.js'

class WalletLayoutContainer extends React.Component {
  constructor (props) {
    super(props)
    this.timeout = undefined
    this.scrollUpdateDelay = 500
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentWillMount () {
    if (!isNil(this.props.scroll)) { this.props.scrollActions.resetScroll() }
  }

  componentWillReceiveProps (nextProps) {
    const yOffset = this.props.scroll.yOffset
    const newYOffset = nextProps.scroll.yOffset
    const element = ReactDOM.findDOMNode(this)
    if (element && !equals(yOffset, newYOffset)) { element.scrollTop = newYOffset }
  }

  componentWillUnmount () {
    if (this.timeout) { clearTimeout(this.timeout) }
  }

  handleScroll () {
    if (this.timeout) { clearTimeout(this.timeout) }
    this.timeout = setTimeout(() => {
      const element = ReactDOM.findDOMNode(this)
      const xOffset = element.scrollLeft
      const yOffset = element.scrollTop
      const xMax = element.scrollWidth - element.offsetWidth
      const yMax = element.scrollHeight - element.offsetHeight
      this.props.scrollActions.updateScroll(xOffset, yOffset, xMax, yMax)
    }, this.scrollUpdateDelay)
  }

  render () {
    return <Page {...this.props} handleScroll={this.handleScroll} />
  }
}

const mapStateToProps = (state) => ({
  scroll: selectors.scroll.selectScroll(state)
})

const mapDispatchToProps = (dispatch) => ({
  scrollActions: bindActionCreators(actions.scroll, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletLayoutContainer)
