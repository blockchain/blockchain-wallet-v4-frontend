import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isEmpty, equals, anyPass, allPass, map, compose, filter, curry, propSatisfies, contains, toUpper, prop, lift, not } from 'ramda'

import { selectors, actions } from 'data'
import Empty from './Empty'
import List from './List'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

import { Remote } from 'blockchain-wallet-v4/src'
import { getContext, getData } from './selectors'

const threshold = 250

class ContentContainer extends React.Component {
  componentWillMount () {
    // if (isEmpty(this.props.transactions)) {
    //   this.fetchTransactions(this.props.source)
    // } else {
    //   this.filterTransactions(this.props.status, this.props.search, this.props.transactions)
    // }
    if (Remote.NotAsked.is(this.props.data)) {
      this.props.dataBitcoinActions.fetchTransactions(this.props.context, true, 0)
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props)
    const update = (currentData, nextData) => {
      console.log(currentData, nextData)
      if (currentData.source !== nextData.source) {
        this.props.dataBitcoinActions.fetchTransactions(nextData.source, true, 0)
      }
    }
    lift(update)(this.props.data, nextProps.data)

  //   if (!equals(this.props.status, nextProps.status) ||
  //     !equals(this.props.search, nextProps.search) ||
  //     !equals(this.props.transactions, nextProps.transactions)) {
  //     this.filterTransactions(nextProps.status, nextProps.search, nextProps.transactions)
  //     return
  //   }

  //   if (!equals(this.props.scroll.yOffset, nextProps.scroll.yOffset)) {
  //     if (nextProps.scroll.yMax - nextProps.scroll.yOffset < threshold) {
  //       this.fetchTransactions(nextProps.source)
  //     }
  //   }
  }

  // shouldComponentUpdate (nextProps) {
  //   if (!equals(this.props.source, nextProps.source)) return true
  //   if (!equals(this.props.status, nextProps.status)) return true
  //   if (!equals(this.props.search, nextProps.search)) return true
  //   if (!equals(this.props.transactions, nextProps.transactions)) return true
  //   return false
  // }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success isEmpty={equals(value.total, 0)} transactions={value.transactions} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

// const mapStateToProps = (state) => {
//   const selector = formValueSelector('bitcoinTransaction')
//   const initialSource = selector(state, 'source')

//   return {
//     source: initialSource ? (initialSource.xpub ? initialSource.xpub : initialSource.address) : '',
//   }
// }

const mapStateToProps = (state) => ({
  data: getData(state),
  context: getContext(state)
  // scroll: selectors.scroll.selectScroll(state)
})

// const mapDispatchToProps = (dispatch) => ({
//   actions: bindActionCreators(actions.modules.transactionBitcoin, dispatch)
// })

const mapDispatchToProps = (dispatch) => ({
  dataBitcoinActions: bindActionCreators(actions.core.data.bitcoin, dispatch)
  // kvStoreBitcoinActions: bindActionCreators(actions.core.kvStore.bitcoin, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer)
