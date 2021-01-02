import React from "react";

import { Jumbotron, Breadcrumb, Button, ButtonGroup, ButtonToolbar, Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Trans } from 'react-i18next';
import { getAuthorization } from "../utils/cognito.js"
import RestUrl from '../rest-url'

export default class RequestJoin extends React.Component {
    handleAccept() {
        this.newStatus('deleted')
    }

    handleReject() {
        this.newStatus('accepted')  // the resulting status of rejecting a deletion is 'accepted'
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
                    <Alert><Trans>You will lose all settings / results regarding this family setting when Accepting!</Trans></Alert>
                    <Trans>You were asked to terminate a family setting with</Trans> {connectedTo}
                    <ButtonToolbar>
                        <ButtonGroup className="mr-2"><Button onClick={() => this.handleAccept()}><Trans>Accept</Trans></Button></ButtonGroup>
                        <ButtonGroup><Button onClick={() => this.handleReject()}><Trans>Reject</Trans></Button></ButtonGroup>
                    </ButtonToolbar>
                </Jumbotron>
            </>
        );
    }
}