import React from "react";

import { Jumbotron, Breadcrumb, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Trans } from 'react-i18next';
import { getAuthorization } from "../utils/cognito.js"
import RestUrl from '../rest-url'

export default class RequestJoin extends React.Component {
    handleAccept() {
        this.newStatus('accepted')
    }

    handleReject() {
        this.newStatus('rejected')
    }

    newStatus(status) {
        console.log('New Status: ', status, this.props.connectedTo)
        getAuthorization((authorization, username) => 
            fetch(RestUrl.url + '/familymember/status', {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    parent_uid: this.props.connectedTo,
                    status: status
                }),
            })
            .then(res => res.json())
            .then((data) => {
                this.props.onStatusChange(status)
            })
            .catch((err) => {
                console.log(err)
                this.props.onStatusChange(null)
            })
        )
    }

    render() {
        const { connectedTo } = this.props;
        return (
            <>
                <Breadcrumb>
                    <LinkContainer to="/">
                        <Breadcrumb.Item active><Trans>Important Request</Trans></Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <Jumbotron>
                    <Trans>You were asked to join a family setting with</Trans> {connectedTo}
                    <ButtonToolbar>
                        <ButtonGroup className="mr-2"><Button onClick={() => this.handleAccept()}><Trans>Accept</Trans></Button></ButtonGroup>
                        <ButtonGroup><Button onClick={() => this.handleReject()}><Trans>Reject</Trans></Button></ButtonGroup>
                    </ButtonToolbar>
                </Jumbotron>
            </>
        );
    }
}