const BLOCKCHAIN_POLLING_INTERVAL = 1000 * 60 * 10 // 10 mins
const NOT_PUSHED = 0
const WAITING_FOR_CONFIRMATIONS = 1
const CONFIRMED = 2

export class BlockchainPoller {
  constructor (state, api) {
    this.state = state
    setInterval(this.poll.bind(this), BLOCKCHAIN_POLLING_INTERVAL)
    this.api = api
  }

  poll  = function () {
    let transactions = this.state.get('transactions').keySeq().toArray()
    if (transactions.length === 0) {
      return
    }
    this.getLatestBlockHeight().then((latestBlockHeight) => {
      for (let i = 0; i < transactions.length; i++) {
        switch (this.state.get('transactions').get(transactions[i]).get('status')) {
          case NOT_PUSHED:
            this.pushTx(transactions[i])
            break
          case WAITING_FOR_CONFIRMATIONS:
            this.checkIfConfirmed(transactions[i], latestBlockHeight)
            break
          case CONFIRMED: // Do nothing
        }
      }
    }).catch((e) => {
      console.error('error getting the latest block', e)
    })
  }

  checkIfConfirmed =  function (tx, latestBlockHeight) {
    this.getTransactionHeight(tx).then((txBlockHeight) => {
      if (latestBlockHeight - txBlockHeight > this.state.get('transactions').get(tx).get('required_confirmation_number')) {
        this.state = this.state.setIn(['transactions', tx, 'status'], CONFIRMED)
            // remove from unconfirmed transactions
            // if transaction is no longer on the chain??????
      }
    }).catch((e) => {
      console.error('error fetching raw tx', e)
    })
  }

  getLatestBlockHeight =  function () {
    return this.api.getLatestBlock().then((response) => {
      let block_height = response.height
      return Promise.resolve(block_height)
    })
  }

  getTransactionHeight =  function (tx) {
    return this.api.getRawTx(tx).then((response) => {
      let block_height = response.block_height
      return Promise.resolve(block_height)
    })
  }


  pushTx =  function (tx) {
    this.api.pushTx(tx).then(() => {
      this.state = this.state.setIn(['transactions', tx, 'status'], WAITING_FOR_CONFIRMATIONS)
    }).catch((e) => {
      console.error('error pushing a transaction ', e)
    })
  }

  addTransaction =  function (txHex, required_confirmation_number) {
    this.state = this.state.setIn(['transactions', txHex, 'status'], NOT_PUSHED)
      .setIn(['transactions', txHex, 'required_confirmation_number'], required_confirmation_number)

    this.pushTx(txHex)
  }

  isTransactionConfirmed =  function (txHex) {
    return this.state.get('transactions').get(txHex).get('status') === CONFIRMED
  }
}
