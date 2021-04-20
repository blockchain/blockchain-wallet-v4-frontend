import React, { ReactNode, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text, TextGroup } from 'blockchain-info-components'

interface Props {
  title: ReactNode
  value: string
}

const RowIcon = styled.div`
  display: flex;
  flex-direction: row;
`

const RowItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  margin-left: 4px;
`

const RowText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.grey900};
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const ToolTipText = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  margin-top: 8px;
  padding: 16px;
  background-color: ${props => props.theme.grey000};

  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TooltipRowItem = ({ title, value }: Props) => {
  const [isActiveCoinTooltip, setCoinToolTip] = useState(false)
  return (
    <RowItemContainer>
      <TopRow>
        <RowIcon>
          <RowText>{title}</RowText>
          <IconWrapper>
            <Icon
              name='question-in-circle-filled'
              size='16px'
              color={isActiveCoinTooltip ? 'blue600' : 'grey300'}
              onClick={() => setCoinToolTip(!isActiveCoinTooltip)}
            />
          </IconWrapper>
        </RowIcon>
        <RowText data-e2e='sbExchangeRate'>{value}</RowText>
      </TopRow>
      {isActiveCoinTooltip && (
        <ToolTipText>
          <Text size='12px' weight={500} color='grey600'>
            <TextGroup inline>
              <Text size='14px'>
                <FormattedMessage
                  id='modals.simplebuy.paying_with_card'
                  defaultMessage='Blockchain.com requires a fee when paying with a card.'
                />
              </Text>
              {/* TODO: update link */}
              <Link
                href='https://blockchain.zendesk.com/hc/en-us/sections/360002593291-Setting-Up-Lockbox'
                size='14px'
                rel='noopener noreferrer'
                target='_blank'
              >
                <FormattedMessage
                  id='modals.simplebuy.summary.learn_more'
                  defaultMessage='Learn more'
                />
              </Link>
            </TextGroup>
          </Text>
        </ToolTipText>
      )}
    </RowItemContainer>
  )
}

export default TooltipRowItem
