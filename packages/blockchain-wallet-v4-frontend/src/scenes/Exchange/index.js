import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import StateSelect from './StateSelect'

class ExchangeContainer extends React.Component {
  constructor (props) {
    super()
    this.state = { storedState: false } // TODO for V3, this is kept in metadata, should come from shapeshift KV
    this.onHandleNextStep = this.onHandleNextStep.bind(this)
  }

  componentWillMount () {
    this.props.dataBitcoinActions.fetchFee()
    this.props.dataEthereumActions.fetchFee()
  }

  onHandleNextStep () {
    // TODO store state selection in metadata
    this.setState({ storedState: true })
  }

  renderComponent (value) {
    return equals(this.props.countryCode, 'US') && !this.state.storedState
      ? <StateSelect handleNextStep={this.onHandleNextStep} />
      : <Success {...value} />
  }

  render () {
    return this.props.data.cata({
      Success: value => this.renderComponent(value),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  countryCode: selectors.core.settings.getCountryCode(state)
})

const mapDispatchToProps = dispatch => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeContainer)
