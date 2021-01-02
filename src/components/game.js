import React from "react";

import { Jumbotron,Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Trans } from 'react-i18next';
import Main from "./sub/main";

export default class Game extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
          score: 0,
        }
    }

    // componentDidMount() {
    //     this.refresh(null)
    // }

    // refresh(e) {
    //     getAuthorization((authorization, username) => 
    //         fetch(RestUrl.url + '/score?member=' + this.props.member, {
    //             method: 'GET',
    //             mode: 'cors',
    //             headers: {
    //                 Authorization: authorization,
    //             }
    //         })
    //         .then(res => res.json())
    //         .then((data) => {
    //             this.setState({ score: data.score })
    //             console.log(this.state.score)
    //         })
    //         .catch(console.log)
    //     )
    // }

    render() {
        let {t, member} = this.props
        return (
            <>
                <Breadcrumb>
                    <LinkContainer to="/home">
                        <Breadcrumb.Item><Trans>Home</Trans></Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to="/family">
                        <Breadcrumb.Item><Trans>Manage Family</Trans></Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to={'/game/' + member}>
                        <Breadcrumb.Item active><Trans>Game</Trans></Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <Jumbotron>
                    <Main t={t} member={member} role='parent'/>
                </Jumbotron>
            </>
        );
    }
}