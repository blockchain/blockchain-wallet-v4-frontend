import axios from 'axios'
import * as kernel from 'web-microkernel'

import './favicons'

const LOCATION_CHANGE = `@@router/LOCATION_CHANGE`

const securityProcessPaths = [
  `/authorize-approve`,
  `/help`,
  `/login`,
  `/logout`,
  `/mobile-login`,
  `/open`,
  `/recover`,
  `/reminder`,
  `/reset-2fa`,
  `/reset-two-factor`,
  `/security-center`,
  `/signup`,
  `/verify-email`
]

const pathnameIsInSecurityProcess = pathname =>
  securityProcessPaths.some(path => pathname.startsWith(path))

;(async () => {
  const rootProcess = kernel.RootProcess()
  rootProcess.addEventListener(`error`, console.error)
  const { createProcess, setForeground } = rootProcess
  const optionsPromise = fetch('/Resources/wallet-options-v4.json')

  const mainProcessPromise = createProcess({
    name: `main`,
    sandbox: `allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts`,
    src: MAIN_DOMAIN + `/index.html#/login`
  })

  const pathname = window.location.hash.slice(1)

  const securityProcess = await createProcess({
    name: `security`,
    // `allow-popups allow-popups-to-escape-sandbox`: Allow downloading of the
    // backup phrase recovery PDF.
    sandbox: `allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts`,
    src: SECURITY_DOMAIN + `/index.html#${pathname}`
  })

  setForeground(securityProcess, `lightgreen`)

  const replaceUrl = url => {
    const data = {}
    const title = ``
    window.history.replaceState(data, title, url)
  }

  // update url with new language without forcing browser reload
  const addLanguageToUrl = language => {
    replaceUrl(`/${language}/${window.location.hash}`)
  }

  const sanitizedAxios = kernel.sanitizeFunction(axios)

  const localStorageProxy = {
    getItem: key => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: key => localStorage.removeItem(key)
  }

  const logout = () => {
    // router will fallback to /login route
    replaceUrl(`#`)
    window.location.reload(true)
  }

  let mainProcessExports
  const mainProcessActions = []

  const processMainActionsQueue = () => {
    if (mainProcessExports) {
      while (mainProcessActions.length > 0) {
        const action = mainProcessActions.shift()
        mainProcessExports.dispatch(action)
      }
    }
  }

  const mainProcessDispatch = action => {
    mainProcessActions.push(action)
    processMainActionsQueue()
  }

  const options = await (await optionsPromise).json()

  const setForegroundProcess = () => {
    const pathname = window.location.hash.slice(1)

    if (pathnameIsInSecurityProcess(pathname)) {
      setForeground(securityProcess)
    } else {
      setForeground(mainProcess)
    }
  }

  const replaceFragment = identifier => {
    const [withoutFragment] = window.location.href.split(`#`)
    replaceUrl(`${withoutFragment}#${identifier}`)
  }

  // We remember the most recent Main Process location so we can revert the
  // address bar to it when the back button is pressed in the Security Center.
  let mainProcessPathname = `/login`

  const dispatchFromSecurityProcess = action => {
    if (action.type === LOCATION_CHANGE) {
      const { pathname } = action.payload.location

      if (pathnameIsInSecurityProcess(pathname)) {
        replaceFragment(pathname)
      } else {
        // If the Security Center is parking at /home then show the most recent
        // location in the Main Process.
        if (pathname === `/home`) {
          replaceFragment(mainProcessPathname)
          setForegroundProcess()

          // Now that the Security Process is in the background it's safe to
          // park it.
          securityProcessExports.dispatch(action)
        } else {
          replaceFragment(pathname)
          mainProcessDispatch(action)
        }
      }
    }
  }

  const securityProcessExports = await securityProcess({
    addLanguageToUrl,
    axios: sanitizedAxios,
    localStorage: localStorageProxy,
    logout,
    mainProcessDispatch,
    options,
    pathname: window.location.pathname,
    rootProcessDispatch: dispatchFromSecurityProcess,
    setForegroundProcess
  })

  const dispatchFromMainProcess = action => {
    if (action.type === LOCATION_CHANGE) {
      const { pathname } = action.payload.location

      // If mainProcessPathname is `/login` then the user just logged in and we
      // want the Security Process to park itself at '/home' while the Main
      // Process has the focus.
      if (
        pathnameIsInSecurityProcess(pathname) ||
        mainProcessPathname === `/login`
      ) {
        securityProcessExports.dispatch(action)
      }

      // The Main Process doesn't have a /security-center route.
      if (pathname !== `/security-center`) {
        mainProcessPathname = pathname
      }

      replaceFragment(pathname)
    }
  }

  const mainProcess = await mainProcessPromise

  const registerProtocolHandler = window.navigator.registerProtocolHandler.bind(
    window.navigator
  )

  mainProcessExports = await mainProcess({
    addLanguageToUrl,
    axios: sanitizedAxios,
    options,
    pathname: window.location.pathname,
    registerProtocolHandler,
    rootProcessDispatch: dispatchFromMainProcess,
    securityProcess: securityProcessExports,
    setForegroundProcess
  })

  processMainActionsQueue()

  window.addEventListener(`popstate`, () => {
    const pathname = window.location.hash.slice(1)

    const action = {
      type: LOCATION_CHANGE,
      meta: { forwarded: true },
      payload: { action: `PUSH`, location: { hash: ``, pathname, search: `` } }
    }

    if (pathnameIsInSecurityProcess(pathname)) {
      securityProcessExports.dispatch(action)
    } else {
      mainProcessDispatch(action)
    }

    setForegroundProcess()
  })
})().catch(console.error)
