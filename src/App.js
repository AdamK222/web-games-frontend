import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css';

import ProtectedRoute from './components/common/ProtectedRoute'
import Index from './components/Index'
import Error404 from './components/Error404'
import Navigation from './components/Navigation'
import Login from './components/Login'
import Register from './components/Register'
import UserInfo from './components/UserInfo'
import Logout from './components/Logout'
import Icons from './components/Icons'
import Chat from './components/Chat'
import ChessMenu from './components/chess/Menu'
import ChessCreate from './components/chess/Create'
import ChessGame from './components/chess/Game'

import { getLoggedUser } from './services/auth'

export default class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      user: getLoggedUser()
      /*
        _id,
        nickname,
        isAdmin,
        iat
      */
    }
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <Navigation user={this.state.user} />
        <Container className="mt-3">
          <Switch>
            <ProtectedRoute
              path="/chess/create"
              render={ props => <ChessCreate {...props} user={this.state.user}/>}
            />
            <Route
              path="/chess/:id"
              render={ props => <ChessGame {...props} user={this.state.user}/>}
            />
            <Route path="/chess" component={ChessMenu}/>
            <ProtectedRoute
              path="/me"
              render={ props => <UserInfo {...props} user={this.state.user}/>}
            />
            <ProtectedRoute
              path="/chat"
              render={ props => <Chat {...props} user={this.state.user}/>}
            />
            <Route path="/register" component={Register}/>
            <Route path="/login" component={Login}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/icon-credits" component={Icons}/>
            <Route path="/404" component={Error404}/>
            <Route path="/" exact component={Index}/>
            <Redirect to='/404' />
          </Switch>
        </Container>
      </React.Fragment>
    );
  }
}
