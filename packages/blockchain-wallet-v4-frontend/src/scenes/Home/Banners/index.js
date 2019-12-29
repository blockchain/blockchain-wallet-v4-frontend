import { connect } from 'react-redux'
import { getData } from './selectors'
import BlockstackBanner from './BlockstackBanner'
import ExchangeBanner from './ExchangeBanner'
import KycResubmit from './KycResubmit'
import React from 'react'
import styled from 'styled-components'

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
      case 'blockstack':
        return (
          <BannerWrapper>
            <BlockstackBanner />
          </BannerWrapper>
        )
      case 'exchange':
        return (
          <BannerWrapper>
            <ExchangeBanner />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Banners)
