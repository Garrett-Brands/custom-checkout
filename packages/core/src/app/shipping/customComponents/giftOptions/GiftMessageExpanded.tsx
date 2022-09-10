import React from "react";
import IconContainer from "../IconContainer";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

const GiftMessageExpanded = (props: any) => {
    const { giftMessageLength } = props
    return(
        <div className="toggle-content-container">
            { giftMessageLength <= 0 ? <p>Add a Gift Message!</p> : <p>Gift Message Included</p> }
            <p className="gift-message-length">{giftMessageLength} / 350</p>
            <IconContainer className='icon-container-remove'>
                <HighlightOffRoundedIcon />
            </IconContainer>
        </div>
    )
}

export default GiftMessageExpanded