import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

class Banners extends React.PureComponent {
  render () {
    const { showSwapBanner, kycNotFinished } = this.props

    return showSwapBanner ? (
      <Swap kycNotFinished={kycNotFinished} />
    ) : (
      <KycResubmit />
    )
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
