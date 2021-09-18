import React from 'react';
import './Card.css';

const Card = ({image, Name, Creds}) => {
    return (
        <div className="prof-card">
            <div className="pf-img">
                <img src={image} alt="" />
            </div>
            <div className="pf_1">
                <h2>{Name}</h2>
                {
                    Creds.map((item,index)=>{
                        return <h3 key={index}>{item}</h3>
                    })
                }
                <div className="crd_1">
                    <h3>edit</h3>
                    <h3>remove</h3>
                </div>
            </div>
        </div>
    )
}

export default Card;
