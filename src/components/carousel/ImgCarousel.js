import React from 'react';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../aasets/shillong.jpg';
import img2 from '../../aasets/agbp.jpg';
import img3 from '../../aasets/controlroom.jpg';
import './ImgCarousel.css';

function ImgCarousel() {

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className='customizeCarousel'>
            <Carousel activeIndex={index} onSelect={handleSelect} indicators="false" data-bs-theme="dark">
                <Carousel.Item className='img'>
                    <img src={img1} height="450px" className="d-block w-100" text="First slide" />
                    <Carousel.Caption>
                        <h4>NEEPCO Corporate Office</h4>
                        <p>Brookland Compound, Lower New Colony <br/>Laitumkhrah, Shillong-793003</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={img2} height="450px" className="d-block w-100" text="Second slide" />
                    <Carousel.Caption>
                        <h4>AGBPS</h4>
                        <p>Agartala, Tripura(W)</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src={img3} height="450px" className="d-block w-100" text="Third slide" />
                    <Carousel.Caption>
                        <h4>Control Room</h4>
                        <p>
                            NEEPCO Ltd.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImgCarousel