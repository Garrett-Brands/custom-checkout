import React from "react";
import IconContainer from "../IconContainer";
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const GiftMessageExpanded = (props: any) => {
    const { giftMessageLength, clearGiftMessage } = props
    return(
        <div className="toggle-content-container">
            { giftMessageLength > 0 ? <p>Gift Message Included</p> : <p>Add a Gift Message!</p> }
            <p className="gift-message-length">{giftMessageLength} / 350</p>
            { giftMessageLength > 0 && 
            <IconContainer className='icon-container-delete' onClick={ clearGiftMessage }>
                <DeleteForeverRoundedIcon />
            </IconContainer>
            }
            <IconContainer className='icon-container-collapse'>
                <ExpandCircleDownRoundedIcon />
            </IconContainer>
        </div>
    )
}

export default GiftMessageExpanded