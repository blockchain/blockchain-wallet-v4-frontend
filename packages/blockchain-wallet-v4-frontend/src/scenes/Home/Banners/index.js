import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getData } from './selectors'
import AirdropClaim from './AirdropClaim'
import AirdropReminder from './AirdropReminder'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
`

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow, kycNotFinished, isSunRiverTagged } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return (
          <BannerWrapper>
            <KycResubmit />
          </BannerWrapper>
        )
      case 'airdropReminder':
        return (
          <BannerWrapper>
            <AirdropReminder
              campaign='sunriver'
              isSunRiverTagged={isSunRiverTagged}
            />
          </BannerWrapper>
        )
      case 'airdropClaim':
        return (
          <BannerWrapper>
            <AirdropClaim campaign='sunriver' />
          </BannerWrapper>
        )
      case 'swap':
        return (
          <BannerWrapper>
            <Swap kycNotFinished={kycNotFinished} />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
