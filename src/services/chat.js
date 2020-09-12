import http from './HTTP'

const url = '/chat'

export async function getMessages() {
  const { data } = await http.get(url)
  return data
}