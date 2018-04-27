import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Text, Tooltip } from 'blockchain-info-components'
import { selectStyle } from './services'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 15px 30px 5px 30px;
  box-sizing: border-box;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${props => props.align === 'right' ? 'flex-end' : 'flex-start'};
  align-items: center;
  width: 100%;

  margin-bottom: 10px;
`
const bounceAnimation = keyframes`
  0%, 100% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
`
const Timeline = styled.div`
  position: relative;
  width: 100%;
  margin: 10px 0;
`
const TimelineItems = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const TimelineItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 33.33%;
`
const TimelineLines = styled.div`
  position: absolute;
  top: 30px;
  left: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Circle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border: 1px solid ${props => props.theme[props.color]};
  border-radius: 50%;
  padding-top: 5px;
  margin-bottom: 15px;
  box-sizing: border-box;
  animation: ${props => props.animation ? `${bounceAnimation} 1.5s infinite ease-in-out;` : 'none'};
`
const Line = styled.div`
  display: none;
  width: 19%;
  height: 1px;
  margin: 0 35px;
  background-color: ${props => props.theme[props.color]};

  @media(min-width: 768px) { display: block; }
`
const Notice = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
const Table = styled.div`
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
  & > :last-child { border-bottom: none; }
  margin-bottom: 10px;
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};

  > :first-child { margin-right: 5px; }
`
const TableCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > :first-child { margin-right: 5px; }
`

const Success = props => {
  const { sourceCoin, targetCoin, status, exchangeRate, transactionFee, orderId, depositAmount, withdrawalAmount, handleClose } = props
  const { color1, color2, color3, animation1, animation2, animation3, icon3 } = selectStyle(status)

  return (
    <Wrapper>
      <Header>
        <Text size='13px' weight={500} capitalize>
          {status === 'complete' && <FormattedMessage id='modals.exchange.shapeshift.title_success' defaultMessage='Success! Your exchange is complete' />}
          {status !== 'complete' && <FormattedMessage id='modals.exchange.shapeshift.title_inprogress' defaultMessage='Exchange In Progress' />}
        </Text>
      </Header>
      <Body>
        <Row>
          <Timeline>
            <TimelineItems>
              <TimelineItem>
                <Circle color={color1} animation={animation1}>
                  <Icon name='paper-airplane' size='28px' color={color1} />
                </Circle>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.send' defaultMessage='Funds sent' />
                </Text>
              </TimelineItem>
              <TimelineItem>
                <Circle color={color2} animation={animation2}>
                  <Icon name='exchange' size='28px' color={color2} />
                </Circle>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.inprogress' defaultMessage='Exchange In Progress' />
                </Text>
              </TimelineItem>
              <TimelineItem>
                <Circle color={color3} animation={animation3}>
                  <Icon name={icon3} size='28px' color={color3} />
                </Circle>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.complete' defaultMessage='Trade Complete' />
                </Text>
              </TimelineItem>
            </TimelineItems>
            <TimelineLines>
              <Line color={color1} />
              <Line color={color2} />
            </TimelineLines>
          </Timeline>
        </Row>
        <Row>
          {status === 'received' &&
            <Notice>
              <Text size='13px' weight={300}>
                <FormattedMessage id='modals.exchange.shapeshift.explain' defaultMessage='Thanks for placing your trade! ' />
                <FormattedMessage id='modals.exchange.shapeshift.explain2' defaultMessage='Exchange trades can take up to two hours, and you can keep track of your trade’s progress in the Order History tab.' />
              </Text>
            </Notice>
          }
          {status === 'complete' &&
            <Notice>
              <Text size='13px' weight={300}>
                <FormattedMessage id='modals.exchange.shapeshift.explain3' defaultMessage='Your exchange is complete.' />
                <FormattedMessage id='modals.exchange.shapeshift.explain4' defaultMessage='It may take a few minutes for the funds to show in your balance.' />
              </Text>
            </Notice>
          }
        </Row>
        <Row>
          <Text size='14px' weight={500} capitalize>
            <FormattedMessage id='modals.exchange.shapeshift.ordersummary' defaultMessage='Order summary' />
          </Text>
        </Row>
        <Row>
          <Table>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.deposited' defaultMessage='{coin} deposited' values={{ coin: sourceCoin }} />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300} uppercase>
                  {`${depositAmount} ${sourceCoin}`}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.received' defaultMessage='{coin} received' values={{ coin: targetCoin }} />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300} uppercase>
                  {`${withdrawalAmount} ${targetCoin}`}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='modals.exchange.shapeshift.received' defaultMessage='Exchange rate' />
                </Text>
                <Tooltip>
                  <FormattedMessage id='modals.exchange.shapeshift.exchangetooltip' defaultMessage='This rate may change depending on the market price at the time of your transaction.' />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300} uppercase>
                  {`1 ${sourceCoin} = ${exchangeRate} ${targetCoin}`}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400}>
                  <FormattedMessage id='modals.exchange.shapeshift.fee' defaultMessage='Transaction fee' />
                </Text>
                <Tooltip>
                  <FormattedMessage id='modals.exchange.shapeshift.feetooltip' defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.' />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300} uppercase>
                  {transactionFee}
                </Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text size='13px' weight={400} capitalize>
                  <FormattedMessage id='modals.exchange.shapeshift.orderid' defaultMessage='Order ID' />
                </Text>
              </TableCell>
              <TableCell>
                <Text size='13px' weight={300} uppercase>
                  {orderId}
                </Text>
              </TableCell>
            </TableRow>
          </Table>
        </Row>
        <Row align='right'>
          <Button nature='primary' size='13px' weight={300} onClick={handleClose}>
            <FormattedMessage id='modals.exchange.shapeshift.close' defaultMessage='Close' />
          </Button>
        </Row>
      </Body>
    </Wrapper>
  )
}

Success.propTypes = {
  sourceCoin: PropTypes.string.isRequired,
  targetCoin: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  exchangeRate: PropTypes.string.isRequired,
  transactionFee: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  depositAmount: PropTypes.string.isRequired,
  withdrawalAmount: PropTypes.string.isRequired
}

export default Success
