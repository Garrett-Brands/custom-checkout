import React from "react";

const GiftMessageDestination = (props: any) => {
    const { shippingAddress } = props
    
    const renderRecipient = () =>{
        if (shippingAddress.firstName && shippingAddress.lastName) {
            return <p className="gift-message-recipient">{shippingAddress.firstName} {shippingAddress.lastName}</p>
        }
    }

    const renderShippingAddress = () => {
        if (shippingAddress) {
            return <p className="gift-message-address">{shippingAddress.address1} {shippingAddress.address2} {shippingAddress.city}, {shippingAddress.stateOrProvinceCode} {shippingAddress.countryCode} {shippingAddress.postalCode}</p>
        }
    }

    const renderRecipientCompany = () => {
        if (shippingAddress.company) {
            return <p className="gift-message-recipient-company">{shippingAddress.company}</p>
        }
    }
    
    return(
        <div className="gift-message-destination-container">
            {renderRecipient()}
            {renderRecipientCompany()}
            {renderShippingAddress()}
        </div>
    )
}

export default GiftMessageDestination