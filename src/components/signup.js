import React from 'react'
import { createUser, verifyUser } from '../utils/cognito'
import { Breadcrumb, FormControl, FormGroup, FormLabel, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Trans } from 'react-i18next';

export default class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeVerifyCode = this.changeVerifyCode.bind(this)
    this.handleSignupSubmit = this.handleSignupSubmit.bind(this)
    this.handleVerifySubmit = this.handleVerifySubmit.bind(this)

    this.state = {
      email: '',
      password: '',
      verifyCode: '',
      showVerification: false,
      verified: false
    }
  }

  changeEmail (e) {
    this.setState({ email: e.target.value })
  }

  changePassword (e) {
    this.setState({ password: e.target.value })
  }

  changeVerifyCode (e) {
    this.setState({ verifyCode: e.target.value })
  }

  handleSignupSubmit (e) {
    const { email, password } = this.state
    e.preventDefault()
    console.log('Entered:', this.state)
    createUser(email, password, (err, result) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(result.user)
      this.setState({ showVerification: true })
    })
  }

  handleVerifySubmit (e) {
    e.preventDefault()
    verifyUser(this.state.email, this.state.verifyCode, (err, result) => {
      if (err) {
        console.log(err)
        return
      }
      this.setState({verified: true})
      alert(result)
    })
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length >= 6;
  }

  render () {
    return (
        <>
            <Breadcrumb>
                <LinkContainer to="/home">
                    <Breadcrumb.Item><Trans>Home</Trans></Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/sign-in">
                    <Breadcrumb.Item><Trans>Sign in</Trans></Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to="/sign-up">
                    <Breadcrumb.Item active><Trans>Sign up</Trans></Breadcrumb.Item>
                </LinkContainer>
            </Breadcrumb>
            {
            !this.state.showVerification ? (
                <form onSubmit={this.handleSignupSubmit}>
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
                        <FormLabel><Trans>New Password</Trans></FormLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.changePassword}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        <Trans>Sign up</Trans>
                    </Button>
                </form>
            ) : (
                <form onSubmit={this.handleVerifySubmit}>
                    <FormGroup controlId="code">
                        <FormLabel><Trans>Verification Code</Trans></FormLabel>
                        <FormControl
                            value={this.state.verifyCode}
                            onChange={this.changeVerifyCode}
                        />
                    </FormGroup>
                    <Button
                        block
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        <Trans>Verify</Trans>
                    </Button>
                </form>
            )
            }
            {this.state.verified ? (<Link to="/sign-in"> Go to Log-in Page </Link>) : (<></>)}
        </>
    )
  }
}