import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import CircularProgressBar from 'components/CircularProgressBar'
import { media } from 'services/styles'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 12px;
  padding: 16px 18px;
  margin: 10px 0;
  cursor: pointer;

  ${media.atLeastLaptop`
    height: 72px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  flex: 1;
`

const ProgressRow = styled.div`
  display: flex;
  justify-content: center;
`

const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
`

const TransactionsLeft = ({ current, limit }: Props) => {
  const percentage = (current * 100) / limit
  return (
    <Wrapper>
      <ProgressRow>
        <ProgressWrapper>
          <CircularProgressBar percentage={percentage} strokeWidth={12}>
            <Text size='16px' color='blue600' weight={600}>
              {`${current}/${limit}`}
            </Text>
          </CircularProgressBar>
        </ProgressWrapper>
      </ProgressRow>
      <Column>
        <Text size='16px' weight={600} color='grey900'>
          <FormattedMessage
            id='scenes.home.banners.transactions_left.title'
            defaultMessage='Transactions Left'
          />
        </Text>
        <Text size='12px' weight={500} color='grey600' style={{ marginTop: '8px' }}>
          <FormattedMessage
            id='scenes.home.banners.transactions_left.description'
            defaultMessage='Unlimited trades and higher limits'
          />
        </Text>
      </Column>
    </Wrapper>
  )
}

type Props = { current: number; limit: number }

export default TransactionsLeft
