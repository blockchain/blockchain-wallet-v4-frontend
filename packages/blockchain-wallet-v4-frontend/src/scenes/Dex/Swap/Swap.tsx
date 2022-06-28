import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconSettings } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'

import PairFlipButton from './components/PairFlipButton'
import SwapPair from './components/SwapPair'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`
const SettingsIcon = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    cursor: pointer;
  }
`
const SwapWrapper = styled.div`
  position: relative;
  > :nth-child(3) {
    margin-top: 8px;
  }
`

const DexSwap = ({ modalActions }: Props) => {
  return (
    <>
      <Header>
        <Text color='textBlack' lineHeight='28px' size='24px' weight={600}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon
          onClick={() => {
            modalActions.showModal(ModalName.DEX_SWAP_SETTINGS, { origin: 'Dex' })
          }}
        >
          <Icon label='settings' color='grey400' size='md'>
            <IconSettings />
          </Icon>
        </SettingsIcon>
      </Header>
      <SwapWrapper>
        <SwapPair coin='ETH' balance={2338934453434522342} />
        <PairFlipButton />
        <SwapPair coin='UNI' balance={8342393453434522342} />
      </SwapWrapper>
      <Button data-e2e='swap' fullwidth jumbo nature='primary' style={{ marginTop: '20px' }}>
        <FormattedMessage id='copy.swap' defaultMessage='Swap' />
      </Button>
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(DexSwap)
