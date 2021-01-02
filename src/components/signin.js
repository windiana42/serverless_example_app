import React, { Component } from 'react'
import { authenticateUser, isSignedIn } from '../utils/cognito'
import { Breadcrumb, FormControl, FormGroup, FormLabel, Button, Alert } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Trans } from 'react-i18next';

export default class Signin extends Component {
  constructor (props) {
    super(props)
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.handleSigninSubmit = this.handleSigninSubmit.bind(this)

    this.state = {
      email: '',
      password: '',
      loading: false,
      message: null,
    }
  }

  changeEmail (e) {
    this.setState({ email: e.target.value })
  }

  changePassword (e) {
    this.setState({ password: e.target.value })
  }

  handleSigninSubmit (e) {
    e.preventDefault()
    this.setState({ loading: true })
    console.log('Entered:', this.state)
    authenticateUser(this.state.email, this.state.password, (err, result) => {
      if (err) {
        const message =
            <Alert bsStyle="warning">
                {err.message}
            </Alert>;
        console.log(err)
        this.setState({ loading: false, message: message })
        return
      }
      console.log(result)
      this.setState({ loading: false, message: null })
      this.props.onSigninSuccess()
    })
  }

  render () {
    return (
        <>
            {isSignedIn() ? (<Redirect to="/"/>) : (<></>)}
            <Breadcrumb>
                <LinkContainer to="/home">
                    <Breadcrumb.Item><Trans>Home</Trans></Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/sign-in">
                    <Breadcrumb.Item active><Trans>Sign in</Trans></Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            <form onSubmit={this.handleSigninSubmit}>
                <FormGroup controlId="email">
                    <FormLabel><Trans>Email</Trans></FormLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.changeEmail}
                    />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormLabel><Trans>Password</Trans></FormLabel>
                    <FormControl
                        value={this.state.password}
                        onChange={this.changePassword}
                        type="password"
                    />
                </FormGroup>
                <Button
                    block
                    disabled={this.state.loading}
                    type="submit"
                >
                    <Trans>Sign in</Trans>
                </Button>
            </form>
        </>
    )
  }
}
