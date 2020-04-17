import { Box } from 'components/Box'
import {
  Button,
  Icon,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { Props, State } from '..'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const DepositBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const AmountRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const Separator = styled.div`
  border: solid 1px ${props => props.theme.grey000};
`

class InterestSummary extends PureComponent<Props, State> {
  render () {
    return (
      <DepositBox>
        <Row>
          <Icon name='btc-circle-filled' color='btc' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginLeft: '8px', lineHeight: '1.5' }}
          >
            Bitcoin
          </Text>
        </Row>
        <Row>
          <TooltipHost id='earninterest.calculation.tooltop'>
            <TooltipIcon name='info' size='12px' />
          </TooltipHost>
          <Text
            size='12px'
            weight={500}
            style={{ marginLeft: '8px', lineHeight: '1.5' }}
          >
            <FormattedMessage
              id='scenes.earninterest.form.earn3percent'
              defaultMessage='Earn 3% AER on your BTC'
            />
          </Text>
        </Row>
        <Separator />
        <AmountRow>
          <AmountColumn>
            <Text
              size='16px'
              color='grey800'
              weight={600}
              style={{ lineHeight: '1.5' }}
            >
              $0.00
            </Text>
            <Text size='12px' style={{ lineHeight: '1.5' }}>
              0.00 BTC
            </Text>
          </AmountColumn>
          <AmountColumn>
            <Text
              size='16px'
              color='grey800'
              weight={600}
              style={{ lineHeight: '1.5' }}
            >
              $0.00
            </Text>
            <Text size='12px' style={{ lineHeight: '1.5' }}>
              Total Interest Earned
            </Text>
          </AmountColumn>
        </AmountRow>
        <Button
          disabled={this.props.isDisabled}
          style={{ marginTop: '16px' }}
          nature='primary'
          fullwidth
          data-e2e='earnInterest'
        >
          <FormattedMessage
            id='scenes.earninterest.form.earnbutton'
            defaultMessage='Earn Interest'
          />
        </Button>
      </DepositBox>
    )
  }
}

export default InterestSummary
