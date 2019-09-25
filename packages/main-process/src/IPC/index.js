import { serializer } from 'blockchain-wallet-v4/src/types'
import Middleware from './Middleware'
import * as kernel from 'web-microkernel'

export default configureStore => () =>
  new Promise(async resolve => {
    const exportedFunction = async imports => {
      const middleware = Middleware({ imports })
      const root = await configureStore({ imports, middleware })

      const dispatch = action => {
        root.store.dispatch({
          ...action,
          meta: { ...action.meta, forwarded: true }
        })
      }

      resolve(root)
      return { dispatch }
    }

    const connection = await kernel.ChildProcess(
      { reviver: serializer.reviver },
      exportedFunction
    )

    connection.addEventListener(`error`, console.error)
  })
