import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Switch } from '@blockchain-com/constellation'
import { bindActionCreators, compose } from 'redux'

import { SpinningLoader, Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild, FlyoutHeader, StickyHeaderWrapper } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { StickyTraitHeader, TraitList } from './components'

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
              <Text size='12px' weight={500}>
                Error: You must select a collection!
              </Text>
            ),
            Loading: () => (
              <Text size='12px' weight={500}>
                Error: You must select a collection!
              </Text>
            ),
            NotAsked: () => <SpinningLoader height='14px' width='14px' borderWidth='3px' />,
            Success: (val) => (
              <>
                <Switch
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
                />
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
                              <div key={value}>
                                {value} {val.traits[trait][value]}
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
