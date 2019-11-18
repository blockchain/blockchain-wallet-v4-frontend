import { serializer } from 'blockchain-wallet-v4/src/types'
import * as kernel from 'web-microkernel'

import Middleware from './Middleware'

export default configureStore => () =>
  new Promise(async resolve => {
    const exportedFunction = async imports => {
      const middleware = Middleware({ imports })
      const root = await configureStore({ imports, middleware })
      resolve(root)

      const dispatch = action =>
        root.store.dispatch({
          ...action,
          meta: { ...action.meta, forwarded: true }
        })

      return { dispatch, securityModule: root.securityModule }
    }

    const childProcess = await kernel.ChildProcess(
      { reviver: serializer.reviver },
      exportedFunction
    )

    childProcess.addEventListener(`error`, console.error)
  })
