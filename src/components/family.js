import React from "react";

import { Jumbotron, Breadcrumb, Table, InputGroup, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { getAuthorization } from "../utils/cognito.js"
import RestUrl from '../rest-url'
import { Link } from "react-router-dom";
import { Trans } from 'react-i18next';
import { ArrowClockwise, Trash } from 'react-bootstrap-icons';

export default class Family extends React.Component {
    constructor (props) {
        super(props)

        this.changeMemberEmail = this.changeMemberEmail.bind(this)

        this.state = {
          members: [],  // {member_uid, parent_uid, status}
          newMemberEmail: '',
        }
    }

    componentDidMount() {
        this.refresh(null)
    }

    refresh(e) {
        getAuthorization((authorization, username) => 
            fetch(RestUrl.url + '/familymembers', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    Authorization: authorization,
                }
            })
            .then(res => res.json())
            .then((data) => {
                this.setState({ members: data.members.Items })
                console.log(this.state.members)
            })
            .catch(console.log)
        )
    }

    handleAddMember() {
        const newMemberEmail = this.state.newMemberEmail.replace("@", "-at-")
        console.log('New Member: ' + newMemberEmail)
        getAuthorization((authorization, username) => 
            fetch(RestUrl.url + '/familymembers', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    member_uid: newMemberEmail
                }),
            })
            .then(res => res.json())
            .then((data) => {
                this.setState({ members: this.state.members.concat([{member_uid: newMemberEmail, status: 'pending'}]) })
                console.log(this.state.members)
                this.setState({ newMemberEmail: ''})
                this.forceUpdate()
            })
            .catch(console.log)
        )
    }

    handleRemoveMember(member) {
        console.log("TODO: remove: " + member.member_uid)

    }

    changeMemberEmail (e) {
        this.setState({ newMemberEmail: e.target.value })
    }

    validateMemberEmail () {
        return this.state.newMemberEmail.length > 0;
    }
    
    render() {
        return (
            <>
                <Breadcrumb>
                    <LinkContainer to="/home">
                        <Breadcrumb.Item><Trans>Home</Trans></Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to="/family">
                        <Breadcrumb.Item active><Trans>Manage Family</Trans></Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <Jumbotron>
                    <h5><Trans>Members associated with your family</Trans>:</h5>
                    {/* <Button onClick={() => this.refresh()}><ArrowClockwise/> <Trans>Refresh</Trans></Button> */}
                    <Table striped bordered hover size="sm" responsive="sm">
                        <thead>
                            <tr>
                                <th><Trans>member email</Trans></th> 
                                <th><Trans>status</Trans></th>
                                <th><Button size="sm" onClick={() => this.refresh()}><ArrowClockwise/></Button></th>
                            </tr> 
                        </thead>
                        <tbody>
                            { this.state.members.map((member) => (<tr>
                                <td><Link to={'/game/' + member.member_uid}>{member.member_uid.replace('-at-', '@')}</Link></td>
                                <td>{member.status}</td>
                                <td><Button size="sm" variant="light" onClick={() => this.handleRemoveMember(member)}><Trash/></Button></td>
                            </tr>)) }
                        </tbody>
                    </Table>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="New family member email"
                            aria-label="New family member email"
                            aria-describedby="basic-addon2"
                            value={this.state.newMemberEmail}
                            onChange={this.changeMemberEmail}
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary"
                                disabled={!this.validateMemberEmail()}
                                type="submit"
                                onClick={() => this.handleAddMember()}
                            >
                                Add
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Jumbotron>
            </>
        );
    }
}