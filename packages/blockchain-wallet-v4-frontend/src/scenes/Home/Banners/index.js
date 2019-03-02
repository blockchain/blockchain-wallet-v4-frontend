import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Airdrop from './Airdrop'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow, kycNotFinished, isSunRiverTagged } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return <KycResubmit />
      case 'airdrop':
        return (
          <Airdrop campaign='sunriver' isSunRiverTagged={isSunRiverTagged} />
        )
      case 'swap':
        return <Swap kycNotFinished={kycNotFinished} />
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
