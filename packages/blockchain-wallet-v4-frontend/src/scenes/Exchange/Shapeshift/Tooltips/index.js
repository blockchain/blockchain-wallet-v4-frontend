import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Tooltip, TextGroup, Link } from 'blockchain-info-components'

const Tooltips = () => {
  return (
    <div>
      <Tooltip id='firststep.tooltip'>
        <TextGroup inline>
          <FormattedMessage
            id='scenes.exchange.shapeshift.firststep.tooltip'
            defaultMessage='This quote may change depending on the market price at the time of your transaction.'
          />
          <Link
            size='12px'
            weight={300}
            href='https://info.shapeshift.io/about'
            target='_blank'
          >
            <FormattedMessage
              id='scenes.exchange.shapeshift.firststep.tooltip2'
              defaultMessage='Learn more'
            />
          </Link>
        </TextGroup>
      </Tooltip>
      <Tooltip id='secondstep.txfeeexplanation'>
        <FormattedMessage
          id='scenes.exchange.shapeshift.secondstep.txfeeexplanation'
          defaultMessage='This fee is used to send the outgoing exchange funds to ShapeShift.'
        />
      </Tooltip>
      <Tooltip id='secondstep.ratetooltip'>
        <FormattedMessage
          id='scenes.exchange.shapeshift.secondstep.ratetooltip'
          defaultMessage='This rate may change depending on the market price at the time of your transaction.'
        />
      </Tooltip>
      <Tooltip id='secondstep.networkfeetooltip'>
        <FormattedMessage
          id='scenes.exchange.shapeshift.secondstep.networkfeetooltip'
          defaultMessage='ShapeShift will use this fee to send the incoming exchange funds to your wallet.'
        />
      </Tooltip>
      <Tooltip id='shapeshift.exchangetooltip'>
        <FormattedMessage
          id='modals.exchange.shapeshift.exchangetooltip'
          defaultMessage='This rate may change depending on the market price at the time of your transaction.'
        />
      </Tooltip>
      <Tooltip id='shapeshift.feetooltip'>
        <FormattedMessage
          id='modals.exchange.shapeshift.feetooltip'
          defaultMessage='This fee is used to send the incoming exchange funds from ShapeShift.'
        />
      </Tooltip>
    </div>
  )
}

export default Tooltips
