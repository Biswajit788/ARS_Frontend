import React from 'react';
//import Navbar from '../layout/Navbar'
//import Footer from '../layout/Footer';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '../card/Card';
import Content from '../carousel/ImgCarousel';
import Marquee from 'react-fast-marquee';
import CustMarquee from '../marquee/CustomMarquee';

const Home = () => {
    return (
        <>
            
            <Container fluid="md">
                <Row className='one'>
                    <Col xs={6} md={4}>
                        <Card />
                    </Col>
                    <Col xs={12} md={8}>
                        <Content />
                    </Col>
                </Row><br />
                <Row className='two'>
                    <Col xs={12}>
                        <Marquee pauseOnHover="true" speed={20} gradient="true" gradientWidth={30}>
                            <CustMarquee />
                        </Marquee>
                    </Col>
                </Row>
            </Container>
            <br />
           
        </>
    )
}

export default Home