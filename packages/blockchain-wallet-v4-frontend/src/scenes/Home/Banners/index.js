import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow, kycNotFinished } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return <KycResubmit />
      case 'swap':
        return <Swap kycNotFinished={kycNotFinished} />
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
