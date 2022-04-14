import React, { memo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import BSOrderBanner from './BSOrderBanner'
import BuyCrypto from './BuyCrypto'
import CoinRename from './CoinRename'
import CompleteYourProfile from './CompleteYourProfile'
import ContinueToGold from './ContinueToGold'
import FinishKyc from './FinishKyc'
import KycResubmit from './KycResubmit'
import NewCurrency from './NewCurrency'
import RecurringBuys from './RecurringBuys'
import { getData } from './selectors'
import ServicePriceUnavailable from './ServicePriceUnavailable'
import StxAidropFundsAvailable from './StxAirdropFundsAvailable'
import TaxCenter from './TaxCenter'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
`

class Banners extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.buySellActions.fetchOrders()
    this.props.buySellActions.fetchSDDEligibility()
    if (this.props.userData.tiers?.current > 0) {
      // we need such to distinguish is profile completed
      this.props.buySellActions.fetchCards(false)
      this.props.buySellActions.fetchPaymentMethods(this.props.fiatCurrency)
      this.props.buySellActions.fetchBalance({ skipLoading: true })
      // TODO move this away from BS
      this.props.buySellActions.fetchLimits(this.props.fiatCurrency)
    }
  }

  render() {
    const { bannerToShow } = this.props.data

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
      case 'servicePriceUnavailable':
        return (
          <BannerWrapper>
            <ServicePriceUnavailable />
          </BannerWrapper>
        )
      case 'stxAirdropFundsAvailable':
        return (
          <BannerWrapper>
            <StxAidropFundsAvailable />
          </BannerWrapper>
        )
      case 'sbOrder':
        return (
          <BannerWrapper>
            <BSOrderBanner />
          </BannerWrapper>
        )
      case 'coinRename':
        return (
          <BannerWrapper>
            <CoinRename />
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
      case 'completeYourProfile':
        return (
          <BannerWrapper>
            <CompleteYourProfile />
          </BannerWrapper>
        )
      case 'recurringBuys':
        return (
          <BannerWrapper>
            <RecurringBuys />
          </BannerWrapper>
        )
      case 'taxCenter':
        return (
          <BannerWrapper>
            <TaxCenter />
          </BannerWrapper>
        )
      default:
        return null
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD'),
  userData: selectors.modules.profile.getUserData(state).getOrElse({
    tiers: { current: 0 }
  } as UserDataType)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(memo(Banners))
