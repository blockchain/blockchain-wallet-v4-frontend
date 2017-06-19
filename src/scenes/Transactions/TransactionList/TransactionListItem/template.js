import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const TransactionListItem = (props) => {
  return (
    <div className='container-fluid padding-30 bg-white border-bottom' styleName='transaction-list-item'>
      <div className='row'>
        <div className='col-3'>
          <div className='row'>
            <div className='col-2'>
              <div className='icon' styleName={(!props.detailsDisplayed ? 'rotated' : '')}>
                <i className='icon-down_arrow' onClick={props.clickDetails} />
              </div>
            </div>
            <div className='col-10 flex-column'>
              <div className='row'>
                <div className='col'>
                  <span className={`text-uppercase ${(props.transaction.type === 'Sent' ? 'sent' : 'received')}`} onClick={props.clickDetails}>{props.transaction.type}</span>
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <span className='f-14 text-italic'>{props.transaction.time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-4 flex-column'>
          <div className='row'>
            <div className='col'>
              <span className='f-14'>To: {props.transaction.to}</span>
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <span className='f-14'>From: {props.transaction.from}</span>
            </div>
          </div>
        </div>
        <div className='col-3'>
          {props.transaction.description
            ? <span className='f-14'>{props.transaction.description} <i className='primary pointer pl-5' /></span>
            : <span className='pointer'>Add a description</span>
          }
        </div>
        <div className='col-2' onClick={props.clickBitcoinDisplay}>
          {props.bitcoinDisplayed ? (
            <BitcoinDisplay className={`button-${(props.transaction.type.toLowerCase())}`} amount={props.transaction.amount} />
          ) : (
            <CurrencyDisplay className={`button-${(props.transaction.type.toLowerCase())}`} amount={props.transaction.amount} />
          )}
        </div>
      </div>
      <div className={`row padding-top-30 ${(!props.detailsDisplayed ? ' hidden' : '')}`}>
        <div className='col-2'>
          <span className='f-14'>{props.transaction.status}</span>
        </div>
        <div className='col-2 offset-8'>
          <span className='f-12'>Value when received: </span>
          <span className='f-12'>{props.transaction.initial_value}</span>
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
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    initial_value: PropTypes.string.isRequired
  })
}

export default CSSModules(TransactionListItem, style)
