import React from "react";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

export default class NavButton extends React.Component {
    render() {
        return (
            <LinkContainer to={this.props.link}>
                <Button variant="primary" size="lg" block>
                    {this.props.value}
                </Button>
            </LinkContainer>
        );
    }
}