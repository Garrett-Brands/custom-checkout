import React, { useEffect, useState } from "react";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
// import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import GiftMessageIcon from "../CustomIcon";
import IconContainer from "../IconContainer";

const GiftMessageToggle = (props: any) => {
    const { giftMessageToggle, toggleGiftMessage, giftMessageLength } = props
    const [className, setClassName] = useState(String)

    useEffect(() => {
        setClassName(() => {
            return giftMessageToggle
            ? 'toggle-gift-message-remove'
            : 'toggle-gift-message-add'
        })
    }, [giftMessageToggle])

    const RemoveGiftMessage = () => {
        return(
            <div className="toggle-content-container">
                { giftMessageLength <= 0 ? <p>Add a Gift Message!</p> : <p>Remove Gift Message</p> }
                <p className="gift-message-length">{giftMessageLength} / 350</p>
                <IconContainer className='icon-container-remove'>
                    <HighlightOffRoundedIcon />
                    {/* <RemoveCircleRoundedIcon /> */}
                </IconContainer>
            </div>
        )
    }

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

    return(
        <div className={className} onClick={toggleGiftMessage}>
            { giftMessageToggle 
            ? <RemoveGiftMessage />
            : <AddGiftMessage /> }
        </div>
    )
}

export default GiftMessageToggle