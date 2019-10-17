import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { pathOr } from 'ramda'
import { actions, model, selectors } from 'data'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import MenuLeft from './template.success'
import Loading from './template.loading'
import Failure from './template.failure'

const { AB_TESTS } = model.analytics
class MenuLeftContainer extends React.PureComponent {
  componentDidMount () {
    if (Remote.Success.is(this.props.abTest)) return
    this.props.analyticsActions.createABTest(AB_TESTS.PIT_CONNECT_TEST)
    window.addEventListener('message', this.receiveMatomoMessage, false)
    // Fallback if a/b test can not be created
    setTimeout(() => {
      if (!Remote.Success.is(this.props.abTest)) {
        this.props.analyticsActions.createABTestSuccess(
          AB_TESTS.PIT_CONNECT_TEST,
          'original'
        )
      }
    }, 1000)
  }

  receiveMatomoMessage = res => {
    if (res.data.from === 'matomo') {
      const result = pathOr('original', ['data', 'command'], res)
      this.props.analyticsActions.createABTestSuccess(
        AB_TESTS.PIT_CONNECT_TEST,
        result
      )
    }
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: val => <MenuLeft {...val} {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: msg => <Failure msg={msg} />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  abTest: selectors.analytics.selectAbTest(AB_TESTS.PIT_CONNECT_TEST)(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuLeftContainer)
