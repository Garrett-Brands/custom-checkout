import React from "react";

const GiftMessageForm = (props: any) => {
    const { setGiftMessage } = props
    const placeholder = "Include up to 350 characters, please do not use emojis or special characters. Don't forget to sign your name!"
    return(
        <textarea maxLength="250" placeholder={placeholder} className="gift-message-input" onChange={event => setGiftMessage(event.target.value)} autoFocus></textarea>
    )
}

export default GiftMessageForm