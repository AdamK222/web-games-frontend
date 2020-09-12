import { logout } from '../services/auth'

const Logout = (props) => {
  logout()
  window.location = "/"

  return null
}

export default Logout;