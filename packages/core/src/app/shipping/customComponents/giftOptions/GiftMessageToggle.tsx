import React, { useEffect, useState } from "react";
import AddGiftMessage from "./AddGiftMessage";
import GiftMessageExpanded from "./GiftMessageExpanded";

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

    return(
        <div className={className} onClick={toggleGiftMessage}>
            { giftMessageToggle 
            ? <GiftMessageExpanded giftMessageLength={ giftMessageLength } />
            : <AddGiftMessage /> }
        </div>
    )
}

export default GiftMessageToggle