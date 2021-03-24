import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { OBInstitution } from 'data/types'

const StyledText = styled(Text)`
  width: 300px;
`

const NavText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-left: 40px;
`

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
`

const BROKERAGE_INELIGIBLE = 'BROKERAGE_INELIGIBLE'

const IneligibleErrorMessage = () => (
  <StyledText size='16px' weight={400}>
    <FormattedMessage
      id='modals.brokerage.ineligible_error'
      defaultMessage='You are not eligible to make deposits and withdrawals with this currency.'
    />
  </StyledText>
)

// getting ready, processing, loading
export enum LoadingTextEnum {
  GETTING_READY = 'Getting Ready...',
  LOADING = 'Loading...',
  PROCESSING = 'Processing...'
}
interface Props {
  text: LoadingTextEnum
}
const Loading = ({ text }: Props) => {
  return (
    <Wrapper>
      <SpinningLoader />
      <Text weight={600} color='grey600' style={{ marginTop: '24px' }}>
        {text === LoadingTextEnum.LOADING && (
          <FormattedMessage id='copy.loading' defaultMessage='Loading...' />
        )}
        {text === LoadingTextEnum.GETTING_READY && (
          <FormattedMessage
            id='loader.message.gettingready'
            defaultMessage='Getting Ready...'
          />
        )}
        {text === LoadingTextEnum.PROCESSING && (
          <FormattedMessage
            id='modals.simplebuy.processing'
            defaultMessage='Processing…'
          />
        )}
      </Text>
    </Wrapper>
  )
}

interface BankIconProps {
  url: string
}

const BankWrapper = styled(FlyoutWrapper)`
  padding: 40px 0;
`

const BankRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 0px solid ${p => p.theme.grey000};
  border-bottom-width: 1px;
  padding: 28px 40px;

  & > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  ${props =>
    props.onClick &&
    css`
      cursor: pointer;
      * {
        cursor: pointer;
      }
      &:hover {
        background-color: ${props => props.theme.blue000};
      }
    `}
`

const BankIcon = styled.div<BankIconProps>`
  height: 30px;
  width: 30px;
  background: url("${p => p.url}") 0 0 no-repeat;
  background-size: 30px;
  background-position: center;
`

const BankSearchInput = styled.input`
  border: 1px solid ${p => p.theme.grey000};
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  border-width: 1px 0;
  padding: 20px 0 20px 40px;

  &:active,
  &:focus {
    outline: none;
  }
`

const SimpleBankRow = (props: {
  institution: OBInstitution
  onClick: () => void
}) => {
  return (
    <BankRow onClick={props.onClick}>
      <div>
        <BankIcon url={props.institution.media[0].source} />
        <Text color='grey900' style={{ marginLeft: '20px' }} weight={600}>
          {props.institution.name}
        </Text>
      </div>
      <Icon
        cursor
        name='chevron-right'
        size='20px'
        color='grey600'
        role='button'
        style={{ marginRight: '24px' }}
      />
    </BankRow>
  )
}

const ModalNavWithBackArrow = props => {
  return (
    <NavText color='grey800' size='20px' weight={600}>
      <Icon
        cursor
        name='arrow-back'
        size='20px'
        color='grey600'
        role='button'
        style={{ marginRight: '24px' }}
        onClick={() => props.handleClose()}
      />
      {props.children}
    </NavText>
  )
}

export {
  BankSearchInput,
  BankWrapper,
  BROKERAGE_INELIGIBLE,
  IneligibleErrorMessage,
  Loading,
  ModalNavWithBackArrow,
  NavText,
  SimpleBankRow
}
