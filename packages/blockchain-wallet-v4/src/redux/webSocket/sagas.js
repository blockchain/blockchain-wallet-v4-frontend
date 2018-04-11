import bitcoin from './bitcoin/sagas'

export default ({ api, socket }) => ({
  bitcoin: bitcoin({ api, socket })
})
