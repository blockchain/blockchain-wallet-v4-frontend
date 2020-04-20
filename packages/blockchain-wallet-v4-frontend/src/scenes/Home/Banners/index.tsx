import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
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

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type Props = ConnectedProps<typeof connector>

export default connector(Banners)
