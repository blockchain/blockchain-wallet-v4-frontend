import React from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { selectors } from 'data'
import { and, equals } from 'ramda'

import Exchange from './template.js'
import MenuTop from './MenuTop'
import StateSelect from './StateSelect'

const Wrapper = styled.div`
  width: 100%;
`

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
    const renderStep = country => and(equals(country, 'US'), !this.state.storedState) ? <StateSelect handleNextStep={this.onHandleNextStep} /> : <Exchange />

    return (
      <Wrapper>
        <MenuTop />
        { renderStep(this.props.countryCode) }
      </Wrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state)
})

export default connect(mapStateToProps)(ExchangeContainer)
