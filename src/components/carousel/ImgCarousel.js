import React from 'react';
import { Carousel } from 'react-bootstrap';
import img1 from '../../assets/KaHEP.jpeg';
import img2 from '../../assets/shillong.jpg';
import img3 from '../../assets/agbp.jpg';
import img4 from '../../assets/controlroom.jpg';
import './ImgCarousel.css';

const ImgCarousel = () => {
    return (
        <div className='custom-carousel'>
            <Carousel className="carousel-container" interval={5000} controls={false} indicators={false} fade>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={img1}
                        alt="Kameng Hydro Power Station"
                    />
                    <Carousel.Caption>
                        <h4>Kameng Hydro Power Station</h4>
                        <p>An Aerial view of KaHPS; a 600MW power station in Arunachal Pradesh</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={img2}
                        alt="NEEPCO Corporate Office"
                    />
                    <Carousel.Caption>
                        <h4>NEEPCO Corporate Office</h4>
                        <p>Brookland Compound, Lower New Colony, Laitumkhrah, Shillong-793003</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={img3}
                        alt="AgGBPS"
                    />
                    <Carousel.Caption>
                        <h4>AgGBPS</h4>
                        <p>Agartala, Tripura(W)</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={img4}
                        alt="Control Room"
                    />
                    <Carousel.Caption>
                        <h4>Control Room</h4>
                        <p>NEEPCO Ltd.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    );
};

export default ImgCarousel;
