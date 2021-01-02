import React from "react";

import { Jumbotron,Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import NavButton from "./navbutton";
import { Trans } from 'react-i18next';

export default class Introduction extends React.Component {
    render() {
        const { t } = this.props;

        return (
            <>
                <Breadcrumb>
                    <LinkContainer to="/home">
                        <Breadcrumb.Item><Trans>Home</Trans></Breadcrumb.Item>
                    </LinkContainer>
                    <LinkContainer to="/introduction">
                        <Breadcrumb.Item active><Trans>Introduction</Trans></Breadcrumb.Item>
                    </LinkContainer>
                </Breadcrumb>
                <Jumbotron>
                    {/* <Trans>introduction</Trans> */}
                    {/* {t('introduction')} */}
                    <Trans i18nKey='introduction.main'>
                        <p> This is just a serverless example app based on react-bootstrap, AWS Lambda, AWS DynamoDB, AWS Cognito that solves a few key problems to get started: </p>
                    </Trans>
                    <ul>
                        <li><Trans i18nKey='introduction.bullet1'>Support desktop and mobile device</Trans></li>
                        <li><Trans i18nKey='introduction.bullet2'>Cognito integration for Login and Registering</Trans></li>
                        <li><Trans i18nKey='introduction.bullet3'>REST API to serverless backend</Trans></li>
                        <li><Trans i18nKey='introduction.bullet4'>DynamoDB put, query, update</Trans></li>
                        <li><Trans i18nKey='introduction.bullet5'>Internationalization</Trans></li>
                    </ul>  
                    <Trans i18nKey='introduction.notyet'>
                        <p> Things that are still missing: </p>
                    </Trans>
                    <ul>
                        <li><Trans i18nKey='introduction.missing1'>Automatic serverless backend setup (serverless.yml)</Trans></li>
                        <li><Trans i18nKey='introduction.missing2'>Automated Testing</Trans></li>
                        <li><Trans i18nKey='introduction.missing3'>Tooling for updating translation files</Trans></li>
                        <li><Trans i18nKey='introduction.missing4'>I guess a lot more...</Trans></li>
                    </ul>  
                    <div className="nav-buttons">
                        <NavButton value={t('Sign in')} link="/sign-in" />
                        <NavButton value={t('Sign up')} link="/sign-up" />
                    </div>
                </Jumbotron>
            </>
        );
    }
}