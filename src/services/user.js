import http from './HTTP'

const url = '/users'

export async function getUser(nickname) {
  if (!nickname) return {}
  const { data } = await http.get(url+'/'+nickname)
  return data
}

export async function getUsers() {
  const { data } = await http.get(url)
  return data
}

export async function register(user) {
  return await http.post(url, user)
}