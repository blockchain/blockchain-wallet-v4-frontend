import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FiatAtTime extends React.PureComponent {
  render () {
    const { data, amount, hash, time, type } = this.props

    return data.cata({
      Success: (value) => <Success
        currency={value}
        amount={amount}
        hash={hash}
        time={time}
        type={type}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state)
})

FiatAtTime.propTypes = {
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
}

export default connect(mapStateToProps)(FiatAtTime)
