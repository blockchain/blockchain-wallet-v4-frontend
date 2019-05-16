import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { head, prop, pathOr } from 'ramda'
import { actions, model, selectors } from 'data'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import MenuLeft from './template.success'
import Loading from './template.loading'
import Failure from './template.failure'

const { AB_TESTS } = model.analytics
class MenuLeftContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      offsetTop: 0
    }
  }

  componentDidMount () {
    this.setActiveNodeOffsetTop()

    // SwapOrTradeTest
    if (Remote.Success.is(this.props.abTest)) return
    this.props.analyticsActions.createABTest(AB_TESTS.SWAP_OR_TRADE_TEST)
    window.addEventListener('message', this.receiveMatomoMessage, false)
    // Fallback if a/b test can not be created
    setTimeout(() => {
      if (!Remote.Success.is(this.props.abTest)) {
        this.props.analyticsActions.createABTestSuccess(
          AB_TESTS.SWAP_OR_TRADE_TEST,
          'original'
        )
      }
    }, 1000)
  }

  componentDidUpdate () {
    window.requestAnimationFrame(() => this.setActiveNodeOffsetTop())
  }

  setActiveNodeOffsetTop () {
    try {
      const node = ReactDOM.findDOMNode(this)
      const activeNode = head(node.getElementsByClassName('active'))
      this.setState({ offsetTop: prop('offsetTop', activeNode) })
    } catch (e) {
      throw new Error(e)
    }
  }

  // SwapOrTradeTest
  receiveMatomoMessage = res => {
    if (res.data.from === 'matomo') {
      const result = pathOr('original', ['data', 'command'], res)
      this.props.analyticsActions.createABTestSuccess(
        AB_TESTS.SWAP_OR_TRADE_TEST,
        result
      )
    }
  }

  render () {
    const { data } = this.props
    const { offsetTop } = this.state

    return data.cata({
      Success: val => <MenuLeft {...val} offsetTop={offsetTop} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: msg => <Failure msg={msg} />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  abTest: selectors.analytics.selectAbTest(AB_TESTS.SWAP_OR_TRADE_TEST)(state)
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuLeftContainer)
