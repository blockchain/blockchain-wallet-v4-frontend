import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { SpinningLoader, Text } from 'blockchain-info-components'
import { OBInstitution } from 'data/types'

const StyledText = styled(Text)`
  width: 300px;
`

const NavText = styled(Text)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
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
const BankIcon = styled.div<BankIconProps>`
  height: 30px;
  width: 30px;
  background: url("${p => p.url}") no-repeat;
`
const SimpleBankRow = (props: { institution: OBInstitution }) => {
  return <BankIcon url={props.institution.media[0].source} />
}

export {
  BROKERAGE_INELIGIBLE,
  IneligibleErrorMessage,
  Loading,
  NavText,
  SimpleBankRow
}
