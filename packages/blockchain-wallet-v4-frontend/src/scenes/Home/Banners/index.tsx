import { actions } from 'data'
import { BannerType, getData } from './selectors'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import CoinifyToSBBanner from './CoinifyToSBBanner'
import FinishKyc from './FinishKyc'
import KycResubmit from './KycResubmit'
import React from 'react'
import SBOrderBanner from './SBOrderBanner'
import styled from 'styled-components'

const BannerWrapper = styled.div`
  margin-bottom: 25px;
  max-width: 1200px;
`

type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  bannerToShow: BannerType
}
type Props = LinkDispatchPropsType & LinkStatePropsType

class Banners extends React.PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.fetchSBOrders()
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
      case 'coinifyToSb':
        return (
          <BannerWrapper>
            <CoinifyToSBBanner />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Banners)
