import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedDate } from 'react-intl'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const TransactionListItem = (props) => {
  return (
    <div className='container-fluid' styleName='transaction-list-item'>
      <div className='row'>
        <div className='col-3'>
          <div className='row'>
            <div className='col-2'>
              <div styleName={(props.detailsDisplayed ? 'icon' : 'icon-rotated')}>
                <i className='icon-down_arrow' onClick={props.clickDetails} />
              </div>
            </div>
            <div className='col-10 d-flex flex-column justify-content-center align-items-start'>
              <span className={`h5 text-uppercase ${(props.transaction.type === 'Sent' ? 'sent' : 'received')}`} onClick={props.clickDetails}>{props.transaction.type}</span>
              <div className='italic'>
                <FormattedDate value={new Date(props.transaction.time * 1000)} />
              </div>
            </div>
          </div>
        </div>
        <div className='col-4 d-flex flex-column justify-content-center align-items-start'>
          <FormattedMessage id='scenes.transactions.transactionlist.transactionlistitem.to' defaultMessage='To : {to}' values={{ to: props.transaction.to }} />
          <FormattedMessage id='scenes.transactions.transactionlist.transactionlistitem.to' defaultMessage='From : {from}' values={{ from: props.transaction.from }} />
        </div>
        <div className='col-3'>
          {props.transaction.description
            ? <span>{props.transaction.description}<i className='primary pointer pl-5' /></span>
            : <span className='pointer'>Add a description</span>
          }
        </div>
        <div className='col-2' onClick={props.clickBitcoinDisplay}>
          <button className={`button-${(props.transaction.type.toLowerCase())}`}>
            { props.bitcoinDisplayed ? (
              <BitcoinDisplay amount={props.transaction.amount} />
            ) : (
              <CurrencyDisplay amount={props.transaction.amount} />
            )}
          </button>
        </div>
      </div>
      <div className={`row padding-top-30 ${(!props.detailsDisplayed ? ' hidden' : '')}`}>
        <div className='col-2'>
          <span>{props.transaction.status}</span>
        </div>
        <div className='col-2 offset-8'>
          <FormattedMessage id='scenes.transactions.transactionlist.transactionlistitem.initial' defaultMessage='Value when received: {value}' values={{ value: props.transaction.initial_value }} />
        </div>
      </div>
    </div>
  )
}

TransactionListItem.propTypes = {
  detailsDisplayed: PropTypes.bool.isRequired,
  clickDetails: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    initial_value: PropTypes.string.isRequired
  })
}

export default CSSModules(TransactionListItem, style)
