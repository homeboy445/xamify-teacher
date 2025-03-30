import React from 'react';

const ImageFrame = ({image}) => {
    return (
        <div className="image-frame">
            <img src={image} alt="" style={{
                marginLeft:"1%"
            }}/>
        </div>
    )
}

export default ImageFrame;
