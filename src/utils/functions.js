import { toast } from 'react-toastify'

export function listenForToasts(locationState) {
  if (locationState && locationState.toast)
    toast[locationState.toast.method](locationState.toast.msg)
}

export async function httpTry(fn, location=null) {
  try {
    await fn()

    if (location) window.location = location
  } catch (ex) {
    if (ex.response && ex.response.status >= 400 && ex.response.status < 500) {
      toast.error(ex.response.data)
    }
  }
}

export function getSize(dom) {
  return dom.getBoundingClientRect()
}