import http from './HTTP'
import jwt from 'jsonwebtoken'

const url = '/auth'
const storageToken = 'token'

http.setJwt(getJwt())

export async function login(email, password) {
  const { data } = await http.post(url, {email, password})

  localStorage.setItem(storageToken, data.token)
}

export function loginByJWT(jwt) {
  localStorage.setItem(storageToken, jwt)
}

export function logout() {
  localStorage.removeItem(storageToken)
}

export function getJwt() {
  return localStorage.getItem(storageToken)
}

export function getLoggedUser() {
  const payload = jwt.decode(getJwt())
  if (!payload) return null
  return payload
}

