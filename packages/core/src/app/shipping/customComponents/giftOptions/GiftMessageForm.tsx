import React, { useState } from "react";
import IconContainer from "../IconContainer";
import GiftMessageIcon from "../CustomIcon";

const GiftMessageForm = (props: any) => {
    const { giftMessage, setGiftMessage } = props
    // const [message, setMessage] = useState('');

    const maxLength = 350
    const maxRows = 10
    const placeholder = "Limited to 350 characters and 10 lines, please do not use emojis or special characters. Don't forget to sign your name!"
    
    const renderGiftMessage = () => {
        if (giftMessage.length > 0) {
            return giftMessage
        }
    }

    // TODO: Replace textarea's onChange with this function
    // const validateAndSanitizeInput = (event) => {
    //     const value = event.target.value.replace(/[^a-zA-Z0-9 .,!?]/g, '');
    //     const lineCount = (value.match(/\n/g) || []).length;
    //     const isInsertingLineBreak = event.nativeEvent.inputType === 'insertLineBreak';
    //     const isInsertingCharacter = event.nativeEvent.inputType !== 'deleteContentBackward';

    //     if (lineCount >= maxRows && isInsertingLineBreak) {
    //     setMessage('You have exceeded the maximum line limit.');
    //     event.preventDefault();
    //     return;
    //     }

    //     if (value.length >= maxLength && isInsertingCharacter) {
    //     setMessage('You have reached the maximum character limit.');
    //     event.preventDefault();

    //     return;
    //     }

    //     setMessage('');
    //     setGiftMessage(value);
    // };
    

    return(
        <>
            <IconContainer className='icon-container-gift-form'>
               <GiftMessageIcon imageSource='https://res.cloudinary.com/garrett-brands/image/upload/v1662682064/Garrett-Website/2022/2-February/Promo%20Details/gift-icon-gold-cropped.png' />
            </IconContainer>
            <textarea
                className="gift-message-input" 
                maxLength={maxLength} 
                rows={maxRows} 
                placeholder={placeholder} 
                onChange={event => setGiftMessage(event.target.value)}
                defaultValue={renderGiftMessage()}>
            </textarea>
        </>
    )
}

export default GiftMessageForm