import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class ExchangeDetails extends React.Component {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success trade={value} {...rest} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

ExchangeDetails.propTypes = {
  address: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.address)
})

const enhance = compose(
  modalEnhancer('ExchangeDetails'),
  connect(mapStateToProps)
)

export default enhance(ExchangeDetails)
