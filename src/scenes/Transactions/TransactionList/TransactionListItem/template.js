import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const TransactionListItem = (props) => {
  return (
    <div className='container-fluid padding-30 bg-white border-bottom' styleName='transaction-list-item'>
      <div className='row'>
        <div className='col-md-2'>
          <div className='row'>
            <div className='col-md-2 flex-center flex-justify f-10' styleName={(!props.detailsDisplayed ? 'rotated' : '')}>
              <i className='icon-down_arrow pointer' onClick={props.clickDetails} />
            </div>
            <div className='col-md-10 flex-column'>
              <span className={`f-16 upper em-500 pointer ${(props.transaction.type === 'Sent' ? 'sent' : 'received')}`} onClick={props.clickDetails}>{props.transaction.type}</span>
              <span className='f-14 italic'>{props.transaction.time}</span>
            </div>
          </div>
        </div>
        <div className='col-md-4 flex-column'>
          <span className='f-14'>To: {props.transaction.to}</span>
          <span className='f-14'>From: {props.transaction.from}</span>
        </div>
        <div className='col-md-4'>
          {props.transaction.description
            ? <span className='f-14'>{props.transaction.description} <i className='ti-pencil primary pointer pl-5' /></span>
            : <span className='mid-grey pointer'>Add a description</span>
          }
        </div>
        <div className='col-md-2'>
          <button className='button-received'>{props.transaction.amount}</button>
        </div>
      </div>
      <div className={`row padding-top-30 ${(!props.detailsDisplayed ? ' hidden' : '')}`}>
        <div className='col-md-2'>
          <span className='f-14'>{props.transaction.status}</span>
        </div>
        <div className='col-md-2 col-md-offset-8'>
          <span className='f-12'>Value when received: </span>
          <span className='f-12 em-500'>{props.transaction.initial_value}</span>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(TransactionListItem, style)
