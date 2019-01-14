import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import SelectBoxBitcoin from './template'

class SelectBoxBtcAddresses extends React.PureComponent {
  render () {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => {
        return <SelectBoxBitcoin elements={value.data} {...rest} />
      },
      Failure: message => <div>{message}</div>,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

SelectBoxBtcAddresses.propTypes = {
  includeAll: PropTypes.bool
}

SelectBoxBtcAddresses.defaultProps = {
  includeAll: true
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

export default connect(mapStateToProps)(SelectBoxBtcAddresses)
