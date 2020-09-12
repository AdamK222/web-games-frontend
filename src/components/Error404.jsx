import React from 'react';
import { Redirect } from 'react-router-dom'

const Error404 = (props) => {
  return (
    <Redirect to={{
      pathname: "/",
      state: {
        from: props.location,
        toast: {method: 'error', msg: 'Error 404: This page does not exist'}
      }
    }}/>
  )
}

export default Error404;