import React from 'react'
import { connect } from 'react-redux'
import { equals } from 'ramda'

import { selectors } from 'data'
import Exchange from './template.js'
import StateSelect from './StateSelect'

class ExchangeContainer extends React.Component {
  constructor (props) {
    super()
    this.state = { storedState: false } // TODO for V3, this is kept in metadata, should come from shapeshift KV
    this.onHandleNextStep = this.onHandleNextStep.bind(this)
  }

  onHandleNextStep () {
    // TODO store state selection in metadata
    this.setState({ storedState: true })
  }

  render () {
    return equals(this.props.countryCode, 'US') && !this.state.storedState
      ? <StateSelect handleNextStep={this.onHandleNextStep} />
      : <Exchange />
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state)
})

export default connect(mapStateToProps)(ExchangeContainer)
