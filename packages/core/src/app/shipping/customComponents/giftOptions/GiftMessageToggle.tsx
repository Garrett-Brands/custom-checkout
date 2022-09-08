import React, { useEffect, useState } from "react";

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
                <p>Remove Gift Message</p>
                <p className="gift-message-length">{giftMessageLength} / 250</p>
            </div>
        )
    }

    const AddGiftMessage = () => {
        return(
            <div className="toggle-content-container">
                <p>Add a Gift Message!</p>
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