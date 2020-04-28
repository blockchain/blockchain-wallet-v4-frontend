import { Banner } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import { CoinType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { FormGroup, FormLabel } from 'components/Form'
import media from 'services/ResponsiveService'
import React from 'react'
import styled, { css } from 'styled-components'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
export const ColLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 50%;
  ${media.mobile`
    width: 100%;
  `};
`
export const ColRight = styled(ColLeft)`
  align-items: flex-end;
`
export const AddressButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey200};

  &:hover {
    background-color: ${props => props.theme.grey000};
  }
`
export const FeeFormContainer = styled.div<{ toggled: boolean }>`
  display: flex;
  flex-direction: ${props => (props.toggled ? 'column' : 'row')};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
export const FeeFormGroup = styled(FormGroup)`
  ${media.mobile`
    flex-direction: column;
  `};
`
export const FeeFormLabel = styled(FormLabel)`
  width: 100%;
  display: flex;
  white-space: nowrap;
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`
export const FeeOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
export const FeePerByteContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
export const CustomFeeAlertBanner = styled(Banner)`
  margin-bottom: 18px;
`
const customCartridge = css`
  display: flex;
  align-items: center;
  font-size: 14px;
`
const CustomBlueCartridge = styled(BlueCartridge)`
  ${customCartridge}
`

export const CustodyToAccountMessage = ({ coin }: { coin: CoinType }) => {
  return (
    <CustomBlueCartridge>
      <FormattedMessage
        id='modals.send.firststep.fromcustody1'
        defaultMessage='At this time, Blockchain.com only allows sending from your {coin} Trading Wallet to your {coin} Wallet.'
        values={{ coin }}
      />
    </CustomBlueCartridge>
  )
}
