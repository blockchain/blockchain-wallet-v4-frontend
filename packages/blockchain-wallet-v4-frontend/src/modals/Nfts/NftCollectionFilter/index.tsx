import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { SpinningLoader, Text } from 'blockchain-info-components'
import Flyout, {
  duration,
  FlyoutChild,
  FlyoutWrapper,
  StickyHeaderWrapper,
  Title,
  Value
} from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { StickyBuyNowRow, StickyTraitHeader, TraitList } from './components'

class NftCollectionFilter extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration + 100)
  }

  handleTraitChange = (name: string, value: string) => {
    this.props.nftActions.updateCollectionFilter({
      isBuyNow: this.props.collectionFilter.isBuyNow,
      trait: {
        name,
        value
      }
    })
  }

  render() {
    const { collection, collectionFilter, nftActions, position, total, userClickedOutside } =
      this.props
    const { show } = this.state

    return (
      <Flyout
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='nftCollectionFilter'
        total={total}
      >
        <FlyoutChild style={{ overflow: 'auto' }}>
          <StickyHeaderWrapper>
            <FlyoutHeader mode='close' data-e2e='collection' onClick={this.handleClose}>
              <FormattedMessage id='copy.collection_filter' defaultMessage='Collection Filter' />
            </FlyoutHeader>
          </StickyHeaderWrapper>
          {collection.cata({
            Failure: () => (
              <FlyoutWrapper>
                <Text size='12px' weight={500}>
                  Error: You must select a collection!
                </Text>
              </FlyoutWrapper>
            ),
            Loading: () => (
              <FlyoutWrapper>
                <Text size='12px' weight={500}>
                  Error: You must select a collection!
                </Text>
              </FlyoutWrapper>
            ),
            NotAsked: () => <SpinningLoader height='14px' width='14px' borderWidth='3px' />,
            Success: (val) => (
              <>
                <StickyBuyNowRow>
                  <Title>
                    <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                  </Title>
                  <Value>
                    {/* <Switch
                      firstItem=''
                      secondItem=''
                      selectedColor={colors.blue400}
                      activeColor={colors.blue600}
                      hoverColor={colors.grey700}
                      isFirstItemActive={collectionFilter.isBuyNow}
                      handleFirstItemClicked={() =>
                        nftActions.updateCollectionFilter({ isBuyNow: !collectionFilter.isBuyNow })
                      }
                      handleSecondItemClicked={() => {
                        nftActions.updateCollectionFilter({ isBuyNow: !collectionFilter.isBuyNow })
                      }}
                    /> */}
                  </Value>
                </StickyBuyNowRow>
                {Object.keys(val.traits).map((trait) => {
                  return (
                    <div key={trait}>
                      <StickyTraitHeader>
                        <Text size='14px' weight={500} color='black'>
                          {trait}
                        </Text>
                      </StickyTraitHeader>
                      <TraitList>
                        {Object.keys(val.traits[trait])
                          .sort((a, b) => (val.traits[trait][a] < val.traits[trait][b] ? 1 : -1))
                          .map((value) => {
                            return (
                              <div
                                key={value}
                                style={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  marginBottom: '4px'
                                }}
                              >
                                <input
                                  onChange={() => this.handleTraitChange(trait, value)}
                                  type='checkbox'
                                  checked={
                                    this.props.collectionFilter.traits[trait] &&
                                    this.props.collectionFilter.traits[trait][value]
                                  }
                                  id={value}
                                />
                                <label
                                  htmlFor={value}
                                  style={{ alignItems: 'center', display: 'flex' }}
                                >
                                  <Text
                                    style={{ marginLeft: '4px' }}
                                    size='12px'
                                    weight={600}
                                    color='black'
                                    capitalize
                                  >
                                    {value}
                                  </Text>
                                  &nbsp;
                                  <Text size='12px' weight={500} color='grey500'>
                                    {val.traits[trait][value]}
                                  </Text>
                                  &nbsp;
                                  <Text size='12px' weight={500} color='grey500'>
                                    (
                                    {(
                                      (Number(val.traits[trait][value]) /
                                        Number(val.stats.total_supply)) *
                                      100
                                    ).toFixed(2)}
                                    %)
                                  </Text>
                                </label>
                              </div>
                            )
                          })}
                      </TraitList>
                    </div>
                  )
                })}
              </>
            )
          })}
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state) => ({
  collection: selectors.components.nfts.getNftCollection(state),
  collectionFilter: selectors.components.nfts.getNftCollectionFilter(state),
  defaultEthAddr: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  nftActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType
export type Props = OwnProps & ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer(ModalName.NFT_COLLECTION_FILTER, { transition: duration }),
  connector
)

export default enhance(NftCollectionFilter)
