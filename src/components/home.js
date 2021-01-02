import React from "react";

import { Jumbotron,Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import NavButton from "./navbutton";
import { Trans } from 'react-i18next';
import Main from "./sub/main";

export default class Home extends React.Component {
    render() {
        const { t, connectedTo } = this.props;
        return (
            <>
                <Breadcrumb>
                    <LinkContainer to="/home">
                        <Breadcrumb.Item active><Trans>Home</Trans></Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <Jumbotron>
                    {
                        (connectedTo !== '') ? (
                            <Main t={t} member='' role='member'/>
                        ): (
                            <div className="nav-buttons">
                                <NavButton value={t('Manage Family')} link="/family" />
                            </div>
                        )
                    }
                </Jumbotron>
            </>
        );
    }
}