import React from 'react';
import { listenForToasts } from '../utils/functions'
import { Link } from 'react-router-dom'

export default class Index extends React.Component {

  componentDidMount() {
    listenForToasts(this.props.location.state)
  }

  render() {
    return (
      <React.Fragment>
        <h2>Welcome to Web Games, fellas :P</h2>
        <footer className="fixed-bottom">
        Copyright &copy; 2020 Web Games. All rights reserved.&nbsp;
        <Link to='/icon-credits'>[Icon credits]</Link>
        </footer>
      </React.Fragment>
    );
  }
}
