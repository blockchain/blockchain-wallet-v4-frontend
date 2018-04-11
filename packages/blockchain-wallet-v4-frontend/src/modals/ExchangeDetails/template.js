import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { merge } from 'ramda'

import { Button, Icon, Modal, ModalHeader, ModalBody, ModalFooter, Text, Tooltip } from 'blockchain-info-components'

const bounceAnimation = keyframes`
  0%, 100% { transform: scale(0.9); }
  50% { transform: scale(1.1); }
`
const Timeline = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
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
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: ${props => props.theme['gray-1']};
  border: 1px solid ${props => props.theme['gray-2']};
`
const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  box-sizing: border-box;
`

const selectStyle = status => {
  const initial = { color1: 'gray-4', animation1: false, color2: 'gray-4', animation2: false, color3: 'gray-4', animation3: false, icon3: 'checkmark' }
  switch (status) {
    case 'no_deposit': return merge(initial, { color1: 'brand-primary', animation1: true })
    case 'received': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', animation2: true })
    case 'failed': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'error', animation3: true, icon3: 'close' })
    case 'complete': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'success', animation3: true })
    case 'resolved': return merge(initial, { color1: 'brand-primary', color2: 'brand-primary', color3: 'brand-secondary', animation3: true, icon3: 'build' })
    default: return initial
  }
}

const ExchangeDetails = (props) => {
  const { position, total, close, trade } = props
  const { status, quote, sourceCoin, targetCoin } = trade
  const { quotedRate, minerFee, orderId, depositAmount, withdrawalAmount } = quote
  const { color1, color2, color3, animation1, animation2, animation3, icon3 } = selectStyle(status)

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        {status === 'complete' && <FormattedMessage id='modals.exchangedetails.title_success' defaultMessage='Success ! Your exchange is complete' />}
        {status !== 'complete' && <FormattedMessage id='modals.exchangedetails.title_inprogress' defaultMessage='Your exchange is in progress' />}
      </ModalHeader>
      <ModalBody>
        <Timeline>
          <TimelineItems>
            <TimelineItem>
              <Circle color={color1} animation={animation1}>
                <Icon name='paper-airplane' size='28px' color={color1} />
              </Circle>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage id='modals.exchangedetails.send' defaultMessage='Funds sent' />
              </Text>
            </TimelineItem>
            <TimelineItem>
              <Circle color={color2} animation={animation2}>
                <Icon name='exchange' size='28px' color={color2} />
              </Circle>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage id='modals.exchangedetails.inprogress' defaultMessage='Exchange In Progress' />
              </Text>
            </TimelineItem>
            <TimelineItem>
              <Circle color={color3} animation={animation3}>
                <Icon name={icon3} size='28px' color={color3} />
              </Circle>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage id='modals.exchangedetails.complete' defaultMessage='Trade Complete' />
              </Text>
            </TimelineItem>
          </TimelineItems>
          <TimelineLines>
            <Line color={color1} />
            <Line color={color2} />
          </TimelineLines>
        </Timeline>
        {status === 'complete' &&
          <Notice>
            <Text size='13px' weight={300}>
              <FormattedMessage id='modals.exchangedetails.explain' defaultMessage='Your exchange is complete.' />
              <FormattedMessage id='modals.exchangedetails.explain2' defaultMessage='It may take a few minutes for the funds to show in your balance.' />
            </Text>
          </Notice>
        }
        <Info>
          <InfoRow>
            <Text size='13px' weight={400} capitalize>
              <FormattedMessage id='modals.exchangedetails.deposited' defaultMessage='{coin} deposited:' values={{ coin: sourceCoin }} />
            </Text>
            <Text size='13px' weight={300} uppercase>
              {`${depositAmount} ${sourceCoin}`}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text size='13px' weight={400} capitalize>
              <FormattedMessage id='modals.exchangedetails.received' defaultMessage='{coin} received:' values={{ coin: targetCoin }} />
            </Text>
            <Text size='13px' weight={300} uppercase>
              {`${withdrawalAmount} ${targetCoin}`}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text size='13px' weight={400}>
              <FormattedMessage id='modals.exchangedetails.received' defaultMessage='Exchange rate:' />
              <Tooltip>
                <FormattedMessage id='modals.exchangedetails.exchangetooltip' defaultMessage='This rate may change depending on the market price at the time of your transaction.' />
              </Tooltip>
            </Text>
            <Text size='13px' weight={300} uppercase>
              {`1 ${sourceCoin} = ${quotedRate} ${targetCoin}`}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text size='13px' weight={400}>
              <FormattedMessage id='modals.exchangedetails.fee' defaultMessage='Transaction fee:' />
              <Tooltip>
                <FormattedMessage id='modals.exchangedetails.feetooltip' defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.' />
              </Tooltip>
            </Text>
            <Text size='13px' weight={300} uppercase>
              {minerFee}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text size='13px' weight={400} capitalize>
              <FormattedMessage id='modals.exchangedetails.orderid' defaultMessage='Order ID:' />
            </Text>
            <Text size='13px' weight={300} uppercase>
              {orderId}
            </Text>
          </InfoRow>
        </Info>
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' size='13px' weight={300} onClick={close}>
          <FormattedMessage id='modals.exchangedetails.close' defaultMessage='Close' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ExchangeDetails.propTypes = {
  trade: PropTypes.object.isRequired
}

export default ExchangeDetails
