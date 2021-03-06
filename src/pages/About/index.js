import React from 'react';

import Header from 'components/Header';

const About = () => (
    <div>
        <Header text='ABOUT GENTO' />
        <p style={{ fontSize: '20px' }}>
                GenTo is a platform that facilitates Initial Coin Offerings. 
                It creates user-defined
                Smart Contracts and automatically deploys them to the blockchain - without the need
                to write a single line of code!
            <br></br>
            <br></br>
                Hiding technical details from the user, we make Initial Coin Offerings accessible for
                a broader, non-technical audience. GenTo provides an intuitive web-based UI that
                guides the user through the contract creation process step by step.
            <br></br>
            <br></br>
                GenTo has been developed by a student group at the chair for Information Systems
                Engineering at Technical University of Berlin in collaboration with venture
                capitalist and startup advisor Globumbus.
            <br></br>
            <br></br>
        </p>
    </div>
)

export default About;