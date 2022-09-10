import React from "react";

const GiftMessageSummary = (props: any) => {
    const { giftMessage } = props
    return(
        <div>
            <p>Gift Message Included</p>
            <p>{giftMessage}</p>
        </div>
    )
}

export default GiftMessageSummary