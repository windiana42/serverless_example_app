import React from 'react'
import { signOut, isSignedIn } from '../utils/cognito'
import { Redirect } from "react-router-dom";

export default class Signout extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    if( isSignedIn() ) {
        signOut()        
        this.props.onSignout()
    }
  }

  render () {
    return (
        <Redirect to="/"/>
    )
  }
}