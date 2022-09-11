import React from "react";
import IconContainer from "../IconContainer";
import GiftMessageIcon from "../CustomIcon";


const GiftMessageForm = (props: any) => {
    const { giftMessage, setGiftMessage } = props
    const maxLength = 350
    const maxRows = 10
    const placeholder = "Include up to 350 characters and 10 lines, please do not use emojis or special characters. Don't forget to sign your name!"
    
    const renderGiftMessage = () => {
        if (giftMessage.length > 0) {
            return giftMessage
        }
    }

    return(
        <>
            <IconContainer className='icon-container-gift-form'>
               <GiftMessageIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662682064/Garrett-Website/2022/2-February/Promo%20Details/gift-icon-gold-cropped.png' />
            </IconContainer>
            <textarea
                className="gift-message-input" 
                autoFocus 
                maxLength={maxLength} 
                rows={maxRows} 
                placeholder={placeholder} 
                onChange={event => setGiftMessage(event.target.value)}>
                    {renderGiftMessage()}
            </textarea>
        </>
    )
}

export default GiftMessageForm