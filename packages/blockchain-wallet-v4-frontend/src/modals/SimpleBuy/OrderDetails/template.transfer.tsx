import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { OwnProps } from '.'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps

const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const InfoContainer = styled.div`
  margin-top: 16px;
`
const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
`
const Title = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`
const Value = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`

const TransferDetails: React.FC<Props> = props => {
  return (
    <FlyoutWrapper>
      <TopText color='grey900' size='20px' weight={600}>
        <FormattedMessage
          id='modals.simplebuy.transferdetails'
          defaultMessage='Transfer Details'
        />
        <Icon
          cursor
          name='close'
          size='20px'
          color='grey600'
          onClick={() => props.handleClose()}
        />
      </TopText>
      <InfoContainer>
        <Text color='grey600' weight={500} size='14px'>
          <FormattedMessage
            id='modals.simplebuy.transferdetails.info'
            defaultMessage='Securely transfer {fiatCurrency} from your bank account to Blockchain.com. Depending on the transfer method and availability of funds, this may take up to 1 business day.'
            values={{
              fiatCurrency: props.order.inputCurrency
            }}
          />
        </Text>
      </InfoContainer>
      <Row>
        <Title />
        <Value />
      </Row>
    </FlyoutWrapper>
  )
}

export default TransferDetails
