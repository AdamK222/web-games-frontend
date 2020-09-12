import React from 'react';
import { Route, Redirect } from 'react-router-dom'

import { getLoggedUser } from '../../services/auth'

const ProtectedRoute = ({component:Component, render, ...rest}) => {
  return (
    <Route 
      {...rest}
      render={props => {
        if (!getLoggedUser()) return <Redirect to={{
          pathname: "/login",
          state: {
            from: props.location,
            toast: {method: 'info', msg: 'You must be logged in to do this.'}
          }
        }}/>
        else return Component ? <Component {...props} /> : render(props)
      }}
    />
  )
}

export default ProtectedRoute;