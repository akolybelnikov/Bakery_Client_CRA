import React from 'react';
import { Link } from "react-router-dom";
import config from "../config";
import { Row, Col, Icon, Card, Breadcrumb } from 'antd';
import styled, { keyframes } from 'styled-components';
import { zoomIn } from 'react-animations';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const zoomInAnimation = keyframes`${zoomIn}`;

const ContactCard = styled(Card)`
    animation: 1.5s ${zoomInAnimation};
    margin: 55% 0 5% 0 !important;
    @media only screen and (max-width: 320px) {
        margin: 150% 0 0 0 !important;
    }
    @media only screen and (min-width: 321px) and (max-width: 375px) {
        margin: 105% 0 0 0 !important;
    }
    @media only screen and (min-width: 376px) and (max-width: 414px) {
        margin: 95% 0 0 0 !important;
    }
    @media only screen and (min-width: 415px) and (max-width: 840px) {
        margin: 70% 0 0 0 !important;
    }
`

const IconRow = styled(Row)`
    margin-top: 25px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        margin-top: 35px;
    }
`;

const BreadCrumbs = styled(Row)`
    color: #331507;
    margin-top: 35px;
`;

const CardRow = styled(Row)`
    
    @media only screen and (max-width: 320px) {
        margin: 7% 0 5% 0;
    }
    @media only screen and (min-width: 321px) and (max-width: 375px) {
        margin: 7% 0 10% 0;
    }
    @media only screen and (min-width: 768px) and (max-width: 1024px) {
        margin: 10% 0 15% 0;
    }
    @media only screen and (min-width: 1025px) {
        margin: 5% 0 15% 0;
    }
`

const ActionSpan = styled.span` 
    margin-left: 15px;
    font-size: 1.2rem;
    color: #331507;
    @media only screen and (max-width: 768px) {
        font-size: 1rem;
    }
`

const TableCell = styled.p`
    color: #331507;
    margin-bottom: 0;
    @media only screen and (min-width: 769px) {
        margin-top: 5px;
    }
`

const GoogleMap = styled(Map)`
    animation: 1.5s ${zoomInAnimation};
    height: 50% !important;
    
`

const FbIcon = styled(Icon)`
    font-size: 28px;
    color: #3b5998;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        font-size: 26px;
    }
    @media only screen and (max-width: 480px) {
        font-size: 18px;
    }
`

const MailIcon = styled.i`
    font-size: 28px;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        font-size: 26px;
    }
    @media only screen and (max-width: 480px) {
        font-size: 18px;
    }
`

const PhIcon = styled(Icon)`
    font-size: 28px;
    color: #fb3958;
    @media only screen and (min-width: 481px) and (max-width: 768px) {
        font-size: 26px;
    }
    @media only screen and (max-width: 480px) {
        font-size: 18px;
    }
`

class Contact extends React.Component {

    handleClick = event => {
        event.preventDefault();
        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <IconRow className="is-hidden-tablet"><Icon onClick={this.handleClick} className="icon-back" type="left" /></IconRow>
                <BreadCrumbs className="is-hidden-mobile">
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item><Link to="/">Новинки</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>Контакт</Breadcrumb.Item>
                    </Breadcrumb>
                </BreadCrumbs>
                <CardRow>
                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }}>
                        <GoogleMap 
                            google={this.props.google} 
                            zoom={15}
                            initialCenter={{
                                lat: 55.715226, 
                                lng: 37.797472
                              }}>
                            <Marker
                                title={'Все Булочки Тут'}
                                name={'Все Булочки Тут'}
                                position={{lat: 55.715226, lng: 37.797472}} />
                            <Marker />
                      </GoogleMap>
                        <ContactCard
                            title={<p>"БУЛОЧНАЯ" Рязанский Пр-т 58/1</p>}
                            actions={[<a href='https://www.facebook.com/Confert.ru' target='_blank' rel="noopener noreferrer"><FbIcon type="facebook" /><ActionSpan className='is-hidden-mobile'>Irina Khmelniker</ActionSpan></a>, <a href='https://www.instagram.com/confertru.ru/' target='_blank' rel="noopener noreferrer"><i className="fa fa-instagram" style={{ color: '#fb3958' }} /> <ActionSpan className='is-hidden-mobile'>confertru.ru</ActionSpan></a>, <a href='https://www.instagram.com/vse_bulochki_tut/' target='_blank' rel="noopener noreferrer"><i className="fa fa-instagram" style={{ color: '#fb3958' }}/><ActionSpan className='is-hidden-mobile'>vse_bulochki_tut</ActionSpan></a>]}>
                            <table style={{margin: '0 auto'}} className='table is-hoverable'>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><PhIcon type="phone"/></p>
                                        </td>
                                        <td>
                                            <TableCell>+7 926 -982-35-72</TableCell>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><PhIcon type="phone"/></p>
                                        </td>
                                        <td>
                                            <TableCell>+7 926-629-87-26</TableCell>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p><MailIcon className="fa fa-envelope-o" /></p>
                                        </td>
                                        <td>
                                            <TableCell>confert76.gmail.com</TableCell>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </ContactCard>
                        <Row className='has-text-centered'>
                            <p className='is-size-7-mobile is-size-6-tablet'>Найдите нас в социальных сетях и отправьте нам сообщение: мы обязательно ответим!</p>
                        </Row>
                    </Col>
                </CardRow>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: config.google.API_KEY
})(Contact)