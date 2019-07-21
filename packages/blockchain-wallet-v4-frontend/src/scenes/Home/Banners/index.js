import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getData } from './selectors'
import KycResubmit from './KycResubmit'
import ThePitBanner from './ThePitBanner'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
  max-width: 1200px;
`

class Banners extends React.PureComponent {
  render () {
    const { bannerToShow } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return (
          <BannerWrapper>
            <KycResubmit />
          </BannerWrapper>
        )
      case 'thepit':
        return (
          <BannerWrapper>
            <ThePitBanner />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
