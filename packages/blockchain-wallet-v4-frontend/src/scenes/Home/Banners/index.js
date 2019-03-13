import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import AirdropClaim from './AirdropClaim'
import AirdropReminder from './AirdropReminder'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow, kycNotFinished, isSunRiverTagged } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return <KycResubmit />
      case 'airdropReminder':
        return (
          <AirdropReminder
            campaign='sunriver'
            isSunRiverTagged={isSunRiverTagged}
          />
        )
      case 'airdropClaim':
        return <AirdropClaim campaign='sunriver' />
      case 'swap':
        return <Swap kycNotFinished={kycNotFinished} />
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
