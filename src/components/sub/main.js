import React from "react";

import NavButton from "../navbutton";
import { Trans } from 'react-i18next';
import { Container, Row } from "react-bootstrap";

export default class Main extends React.Component {
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
                {
                    (member !== '') ? (
                        <>
                            <h5><Trans>You are connected to</Trans> {member.replace('-at-', '@')}</h5>
                            <h5><Trans>The score is</Trans>:</h5>
                        </>
                    ) : (
                        <h5><Trans>Your score is</Trans>:</h5>
                    )
                }
                <Container><Row className="justify-content-md-center"><h1>{this.state.score}</h1></Row></Container>
                <div className="nav-buttons">
                    <NavButton value={t('Update score')} link={'/update_score/' + member} />
                </div>
            </>
        );
    }
}