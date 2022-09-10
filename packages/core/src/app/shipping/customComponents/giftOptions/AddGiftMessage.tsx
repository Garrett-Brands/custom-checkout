import React from "react";
import IconContainer from "../IconContainer";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import GiftMessageIcon from "../CustomIcon";

const AddGiftMessage = () => {
    return(
        <div className="toggle-content-container">
            <p>Add a Gift Message!</p>
                <IconContainer className='icon-container-gift-header'>
                    <GiftMessageIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662682064/Garrett-Website/2022/2-February/Promo%20Details/gift-icon-white-cropped.png' />
                </IconContainer>
                <IconContainer className='icon-container-add'>
                    <AddCircleRoundedIcon />
                </IconContainer>
        </div>
    )
}

export default AddGiftMessage