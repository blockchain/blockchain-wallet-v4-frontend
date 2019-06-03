import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getData } from './selectors'
import KycResubmit from './KycResubmit'
import Swap from './Swap'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
  max-width: 1200px;
`

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow, kycNotFinished } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return (
          <BannerWrapper>
            <KycResubmit />
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
