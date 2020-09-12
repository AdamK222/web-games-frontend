import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Identicon from 'identicon.js'

const Navigation = ({ user }) => {
  let icon
  if (user) {
    icon = new Identicon(user.nickname+user._id,{
      size: 26
    }).toString()
  }

  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" className="fixed-top">
        <Navbar.Brand>
          <NavLink to="/">Web Games (v. 0.1)</NavLink>
        </Navbar.Brand>
        <Nav>
          <NavLink activeStyle={{fontWeight: 700}} className="nav-item nav-link" to="/chess">Chess</NavLink>
          
          {user
            ? <React.Fragment>
              <NavLink activeStyle={{fontWeight: 700}} className="nav-item nav-link" to="/chat">Chat</NavLink>
              <NavLink activeStyle={{fontWeight: 700}} className="nav-item nav-link" to="/me">
                <img src={`data:image/png;base64,${icon}`} alt={user.nickname} />
                {" "+user.nickname}
              </NavLink>
            </React.Fragment>
            : <React.Fragment>
              <NavLink activeStyle={{fontWeight: 700}} className="nav-item nav-link" to="/register">Register</NavLink>
              <NavLink activeStyle={{fontWeight: 700}} className="nav-item nav-link" to="/login">Log in</NavLink>
            </React.Fragment>
          }
        </Nav>
      </Navbar>
      <div id="nav-placeholder" style={{"height": 58}}></div>
    </React.Fragment>
  )
}

export default Navigation;