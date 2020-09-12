import http from './HTTP'

const url = "/rooms/chess"

export async function getChessRoom(id) {
  const { data } = await http.get(url+'/'+id)
  return data
}

export async function getChessRooms() {
  const { data } = await http.get(url)
  return data
}

export async function createChessRoom(name, player2Id) {
  const { data } = await http.post(url, {name, player2Id})
  return data
}