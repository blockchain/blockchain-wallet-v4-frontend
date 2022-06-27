import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon } from '@blockchain-com/constellation'
import { IconDeposit, IconSettings } from '@blockchain-com/icons'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'

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
const PairWrapper = styled.div`
  height: 40px;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;
  padding: 8px 16px;
`
const PairTransition = styled.div`
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.white};

  > :nth-child(1) {
    position: relative;
    top: 8px;
    left: 8px;
    z-index: 99 !important;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.grey000};
  }
`

const DexSwap = ({ modalActions }: Props) => {
  return (
    <>
      <Header>
        <Text color='textBlack' lineHeight='135%' size='24px' weight={600}>
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
        <PairWrapper />
        <PairTransition>
          <Icon label='arrow down' color='grey400' size='sm'>
            <IconDeposit />
          </Icon>
        </PairTransition>
        <PairWrapper />
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
