import React, { useEffect, useState } from "react";
import GiftMessageCollapsed from "./GiftMessageCollapsed";
import GiftMessageExpanded from "./GiftMessageExpanded";

const GiftMessageToggle = (props: any) => {
    const { giftMessageToggle, toggleGiftMessage, giftMessageLength, clearGiftMessage } = props
    const [className, setClassName] = useState(String)

    useEffect(() => {
        setClassName(() => {
            return giftMessageToggle
            ? 'toggle-gift-message-collapse'
            : 'toggle-gift-message-expand'
        })
    }, [giftMessageToggle])

    return(
        <div className={className} onClick={toggleGiftMessage}>
            { giftMessageToggle 
            ? <GiftMessageExpanded 
                giftMessageLength={ giftMessageLength } 
                clearGiftMessage={ clearGiftMessage } />
            : <GiftMessageCollapsed 
                giftMessageLength={ giftMessageLength } /> }
        </div>
    )
}

export default GiftMessageToggle