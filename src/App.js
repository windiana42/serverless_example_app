import './App.css';

import React, {Suspense} from "react";
import { MemoryRouter, BrowserRouter, Switch, Route, Link, useParams, Redirect } from "react-router-dom";

import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown, Spinner, Button } from "react-bootstrap";
import { ArrowClockwise } from 'react-bootstrap-icons';
import { getAuthorization, isSignedIn, getUserEmail } from "./utils/cognito"
import RestUrl from './rest-url'
import { useTranslation, Trans } from 'react-i18next';

import SignIn from "./components/signin";
import SignUp from "./components/signup";
import SignOut from "./components/signout";
import Introduction from "./components/introduction";
import Home from "./components/home";
import Family from "./components/family";
import Game from "./components/game";
import RequestJoin from './components/request_join';
import RequestDelete from './components/request_delete';

function GameFct(props) {
    let {member} = useParams()
    return (<Game t={props.t} member={member}/>)
}

class TheApp extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            connectedTo: '',
            memberStatus: 'unknown'
        }
    }

    componentDidMount() {
        this.refresh(null)
    }

    refresh(e) {
        getAuthorization((authorization, username) => 
            fetch(RestUrl.url + '/familymember?member_uid=' + username, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    Authorization: authorization,
                }
            })
            .then(res => res.json())
            .then((data) => {
                var memberStatus = ''
                var connectedTo = ''
                if(data.members.Items.length === 0) {
                    memberStatus = 'main'
                    connectedTo = ''
                } else {
                    memberStatus = data.members.Items[0].status
                    connectedTo = data.members.Items[0].parent_uid
                }
                this.setState({ memberStatus: memberStatus, connectedTo: connectedTo })
                console.log(this.state.memberStatus)
            })
            .catch((err) => {
                this.setState({ memberStatus: 'unknown', connectedTo: '' })
                console.log(err)
            })
        )
    }

    render() {
        let {t, i18n} = this.props

        const changeLanguage = lng => {
            i18n.changeLanguage(lng);
        };

        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Container className="app">
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/">Serverless Example</Navbar.Brand>
                        <NavDropdown title="Lang" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => changeLanguage('en')}>en</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => changeLanguage('de')}>de</NavDropdown.Item>
                        </NavDropdown>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="login_signup">
                            <Nav className="ml-auto">
                                <Nav.Item> { getUserEmail() } </Nav.Item>
                                <Nav.Link as={Link} to="/introduction"><Trans>Intro</Trans></Nav.Link>
                                <Nav.Link as={Link} to="/sign-in"><Trans>Sign in</Trans></Nav.Link>
                                <Nav.Link as={Link} to="/sign-up"><Trans>Sign up</Trans></Nav.Link>
                                <Nav.Link as={Link} to="/sign-out"><Trans>Sign out</Trans></Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    {/* member status: {this.state.memberStatus} / {this.state.connectedTo} */}
                    {
                        (!isSignedIn()) ? 
                        (
                            <Switch>
                                <Route exact path="/"><Introduction t={t}/></Route>
                                <Route 
                                    path="/sign-in" 
                                    render={(props) => (
                                        <SignIn {...props} t={t} onSigninSuccess={() => {this.refresh(null);this.forceUpdate()}} />
                                    )}/>
                                <Route path="/sign-up"><SignUp t={t}/></Route>
                                <Route
                                    path="/sign-out" 
                                    render={(props) => (
                                        <SignOut {...props} t={t} onSignout={() => {this.refresh(null);this.forceUpdate()}} />
                                    )}/>
                                <Route path="/introduction"><Redirect to="/"/></Route>
                            </Switch>
                        ): (this.state.memberStatus === 'unknown') ?
                        (
                            <>
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                                <Button size="sm" onClick={() => this.refresh()}><ArrowClockwise/></Button>
                            </>
                        ): (this.state.memberStatus === 'pending') ?
                        (
                            <>
                                {/*Consider using status change parameter directly*/}
                                <RequestJoin t={t} connectedTo={this.state.connectedTo} onStatusChange={(newStatus) => {this.refresh(null);this.forceUpdate()}}/>
                            </>
                        ): (this.state.memberStatus === 'deleting') ?
                        (
                            <>
                                {/*Consider using status change parameter directly*/}
                                <RequestDelete t={t} connectedTo={this.state.connectedTo} onStatusChange={(newStatus) => {this.refresh(null);this.forceUpdate()}}/>
                            </>
                        ):
                        (
                            <Switch>
                                <Route exact path="/"><Redirect to="/home"/></Route>
                                <Route path="/home"><Home t={t} connectedTo={(this.state.memberStatus === 'accepted') ? this.state.connectedTo:''}/></Route>
                                <Route path="/family"><Family t={t}/></Route>
                                <Route 
                                    path="/sign-in" 
                                    render={(props) => (
                                        <SignIn {...props} t={t} onSigninSuccess={() => this.forceUpdate()} />
                                    )}/>
                                <Route path="/sign-up"><SignUp t={t}/></Route>
                                <Route
                                    path="/sign-out" 
                                    render={(props) => (
                                        <SignOut {...props} t={t} onSignout={() => this.forceUpdate()} />
                                    )}/>
                                <Route path="/introduction"><Introduction t={t}/></Route>
                                <Route path="/game/:member" children={<GameFct t={t}/>} />
                            </Switch>
                        )
                    }
                </Container>
            </BrowserRouter>
        )
    }
}

function AppT() {
    const { t, i18n } = useTranslation();

    return (
        <TheApp t={t} i18n={i18n}/>
    )
}

const App = () => (
    <Suspense fallback="loading">
        <AppT/>
    </Suspense>
)

export default App;