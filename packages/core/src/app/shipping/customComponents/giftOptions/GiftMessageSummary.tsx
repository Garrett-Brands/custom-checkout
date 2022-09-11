import React, { useState } from "react";
import IconContainer from "../IconContainer";
import GiftMessageIcon from "../CustomIcon";

const GiftMessageSummary = (props: any) => {
    const { giftMessage } = props
    const [showGiftMessagePreview, setShowGiftMessagePreview] = useState(Boolean)

    return(
        <div className="gift-message-summary-container" onMouseEnter={() => setShowGiftMessagePreview(true)} onMouseLeave={() => setShowGiftMessagePreview(false)}>
            <IconContainer className='gift-message-icon-container'>
                <GiftMessageIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662682064/Garrett-Website/2022/2-February/Promo%20Details/gift-icon-gold-cropped.png' />
            </IconContainer>
            { giftMessage.length > 0 ? <p>Gift Message Included</p> : <p>No Gift Message Included</p> }
            {showGiftMessagePreview && <p>{giftMessage}</p>}
        </div>
    )
}

export default GiftMessageSummary