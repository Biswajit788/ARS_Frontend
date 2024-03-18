import React, { Component } from 'react';

import khep from '../../aasets/KHEP.png';
import dhep from '../../aasets/DHEP.png';
import kahep from '../../aasets/KaHEP.png';
import phep from '../../aasets/PHEP.png';
import plhps from '../../aasets/PLHPS.png';
import trhep from '../../aasets/TrHEP.png';
import agbps from '../../aasets/agbps.png';
import tgbps from '../../aasets/tgbps.png';
import agtbps from '../../aasets/agtbps.png';

import './CustomMarquee.css';

export class CustomMarquee extends Component {
    render() {
        return (
            <div className='cust-marquee'>
                <div className='marquee-container'>
                    <div className='card'>
                        <div className='chid-card1'>
                            <img src={khep} height="120px" width="220px" alt="Kopili Hydro Power Station" />
                            <h5>KHPS</h5>
                            <p>
                                <strong>Kopili Hydro Power Station</strong> was the maiden venture of NEEPCO when it came into existence in 1976.
                                The installed capacity of the Station is 275 MW with a catchment area of 1256 Sq. Km and design head
                                of about 99 m for Khandong PS (50 MW) & Khandong Stage II PS (25 MW) and 326.5 m for the Kopili PS (200 MW).
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card2'>
                            <img src={dhep} height="120px" width="220px" alt="Doyang Hydro Power Station" />
                            <h5>DHPS</h5>
                            <p>
                                <strong>Doyang Hydro Power Station</strong> is a medium head storage scheme to harness the hydro power of Doyang River
                                 ( a tributary of River Brahmaputra) and located in Wokha district, Nagaland. The installed capacity
                                  of the Station is 75 MW with a catchment area of 2606 Sq. Km and design head of 67 m.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card3'>
                            <img src={kahep} height="120px" width="220px" alt-="Kameng Hydro Power Station" />
                            <h5>KaHPS</h5>
                            <p>
                                <strong>Kameng Hydro Power Station</strong> is a run-of-the river scheme to harness the hydro power of Bichom and Tenga Rivers
                                 (both tributaries of the River Kameng) with the Power House located at Kimi, West Kameng District, Arunachal Pradesh.
                                 The installed capacity of the Station is 600 MW with a catchment area of 2277 Sq. Km (Bichom) & 1019 Sq. Km (Tenga) and design head of 504 m.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card4'>
                            <img src={plhps} height="120px" width="220px" alt-="Kameng Hydro Power Station" />
                            <h5>PLHPS</h5>
                            <p>
                                <strong>Panyor Lower Hydro Power Station</strong> (formerly Ranganadi Hydro Power Station) is a run-of-the-river scheme with a small pondage to harness the
                                 hydro power of Ranganadi River with the Power House located at Hoz, Papum Pare District and the Dam located at Lower Subansiri District, Arunachal Pradesh.
                                  The installed capacity of the Plant is 405 MW with a catchment area of 1894 Sq. Km and design head of 304 m.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card5'>
                            <img src={phep} height="120px" width="220px" alt-="Pare Hydro Power Station" />
                            <h5>PHPS</h5>
                            <p>
                                <strong>Pare Hydro Power Station</strong> is a run-of-the river scheme to harness the hydro power of Dikrong River (a tributary of river Brahmaputra) and located at Sopo, Papum Pare District, Arunachal Pradesh. 
                                The installed capacity of the Plant is 110 MW with a catchment area of 824 Sq. Km and design head of 67.36m.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card6'>
                            <img src={trhep} height="120px" width="220px" alt-="Tuirial Hydro Power Station" />
                            <h5>TrHPS</h5>
                            <p>
                                <strong>Tuirial Hydro Power Station</strong> is medium head storage scheme to harness the hydro power of Tuirial River
                                 and located at Saipum, Kolasib District of Mizoram. The installed capacity of the Station is 60 MW with a catchment area of 1861  Sq. Km and design head of 53 m.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card7'>
                            <img src={agbps} height="120px" width="220px" alt-="Assam Gas Based Power Station" />
                            <h5>AGBPS</h5>
                            <p>
                                <strong>Assam Gas Based Power Station</strong> is located in the Dibrugarh District of Assam.
                                The power station comprises of 6 Gas Turbines with associated Waste Heat Recovery Boilers and 3 Steam Turbines , arranged in a modular fashion. A module comprises of 2 Gas Turbines with associated Waste Heat Recovery Boilers and 1 steam turbine.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card8'>
                            <img src={agtbps} height="120px" width="220px" alt-="Agartala Gas Based Power Station" />
                            <h5>AgGBPS</h5>
                            <p>
                                <strong>Agartala Gas Based Power Station</strong>This 135 MW (4 x 21 MW + 2 x 25.5 MW) Combined Cycle Power Plant is located in the West Tripura District of the state of Tripura near the capital town of Agartala.
                                The plant is presently running as a combined cycle unit with 2 (two) modules consisting of two Gas Turbines, two HRSGs and one Steam Turbine in each module.
                            </p>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='chid-card9'>
                            <img src={tgbps} height="120px" width="220px" alt-="Agartala Gas Based Power Station" />
                            <h5>TGBPS</h5>
                            <p>
                                This Combined Cycle project is located in the Sepahijala District of the state of Tripura around 60 Kms away from the capital town of Agartala. The project runs
                                 on Combined Cycle Mode and consists of one Gas Turbines of 65.42 MW & one Steam Turbine of 35.58 MW each of BHEL supplied operating on natural gas obtained from the gas fields of M/S ONGC.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CustomMarquee