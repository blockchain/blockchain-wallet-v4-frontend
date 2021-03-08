import React, { memo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions } from 'data'
import BuyCrypto from './BuyCrypto'
import ContinueToGold from './ContinueToGold'
import FinishKyc from './FinishKyc'
import KycResubmit from './KycResubmit'
import NewCurrency from './NewCurrency'
import SBOrderBanner from './SBOrderBanner'
import { getData } from './selectors'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
  max-width: 1200px;
`

class Banners extends React.PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.fetchSBOrders()
    this.props.simpleBuyActions.fetchSDDEligible()
  }

  render () {
    const { bannerToShow } = this.props

    switch (bannerToShow) {
      case 'resubmit':
        return (
          <BannerWrapper>
            <KycResubmit />
          </BannerWrapper>
        )
      case 'finishKyc':
        return (
          <BannerWrapper>
            <FinishKyc />
          </BannerWrapper>
        )
      case 'sbOrder':
        return (
          <BannerWrapper>
            <SBOrderBanner />
          </BannerWrapper>
        )
      case 'newCurrency':
        return (
          <BannerWrapper>
            <NewCurrency />
          </BannerWrapper>
        )
      case 'buyCrypto':
        return (
          <BannerWrapper>
            <BuyCrypto />
          </BannerWrapper>
        )
      case 'continueToGold':
        return (
          <BannerWrapper>
            <ContinueToGold />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(memo(Banners))
