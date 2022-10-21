import React from "react";

const GiftMessageDestination = (props: any) => {
    const { shippingAddress } = props

    const renderShippingAddress = () => {
        if (shippingAddress) {
            return `${shippingAddress.address1} ${shippingAddress.address2} ${shippingAddress.city}, ${shippingAddress.stateOrProvinceCode} ${shippingAddress.countryCode} ${shippingAddress.postalCode}`
        }
    }
    
    return(
        <div className="gift-message-destination-container">
            <p>{renderShippingAddress()}</p>
        </div>
    )
}

export default GiftMessageDestination