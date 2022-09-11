import React from "react";
import IconContainer from "../IconContainer";
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import GiftMessageIcon from "../CustomIcon";

const GiftMessageCollapsed = (props: any) => {
    const { giftMessageLength } = props
    return(
        <div className="toggle-content-container">
            { giftMessageLength > 0 ? <p>Gift Message Included</p> : <p>Add a Gift Message!</p> }
                <IconContainer className='icon-container-gift-header'>
                    <GiftMessageIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662682064/Garrett-Website/2022/2-February/Promo%20Details/gift-icon-white-cropped.png' />
                </IconContainer>
                <IconContainer className='icon-container-expand'>
                    <ExpandCircleDownRoundedIcon />
                </IconContainer>
        </div>
    )
}

export default GiftMessageCollapsed