import React from "react";
import CookAndShipIcon from "../CustomIcon";
import EstimatedArrivalIcon from "../CustomIcon";
import IconContainer from "../IconContainer";

const ShippingInfoBanner = (props: any) => {
    const { mainMessage, secondMessage } = props
    return(
        <div className="shipping-info-banner">
            <div className="banner-icons-container">
                    <IconContainer className='banner-icon-container'>
                        <CookAndShipIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1665017783/Garrett-Website/2022/9-September/Checkout%20Icons/cook-date.svg' />
                    </IconContainer>
                    <IconContainer className='banner-icon-container'>
                        <EstimatedArrivalIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1663968753/Garrett-Website/2022/9-September/Checkout%20Icons/arrival-estimate.svg' />
                    </IconContainer>
                </div>
            <div className="banner-message-container">
                <p className="banner-main-message">{ mainMessage }</p>
                <p className="banner-second-message">{ secondMessage }</p>
            </div>
        </div>
    )
}

export default ShippingInfoBanner