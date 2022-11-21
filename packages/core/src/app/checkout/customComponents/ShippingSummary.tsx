import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import ArrivalDate from "../../shipping/customComponents/shipDate/ArrivalDate";
import GiftMessageSummary from "../../shipping/customComponents/giftOptions/GiftMessageSummary";

const ShippingSummary = (props: any) => {
    const { giftMessage, cart, consignment } = props

    var isActiveCart: boolean
    var savedCartID: { fieldValue: any; }
    savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
    isActiveCart = cart.id === savedCartID?.fieldValue

    // const renderShipDate = () => {
    //     if (shipDate.getYear() !== 69) {
    //         return <SelectedShipDate shipDate={ shipDate } />
    //     }
    // }

    // const renderArrivalDate = () => {
    //     if (arrivalDate.getYear() !== 69) {
    //         return <ArrivalDate arrivalDate={ arrivalDate } />
    //     }
    // }

    const renderShipDate = () => {
        var savedShipDate
        savedShipDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_30')
        savedShipDate = savedShipDate?.fieldValue
        // if (shipDate.getYear() !== 69) {
        //     return <SelectedShipDate shipDate={ shipDate } />
        // } 
        if (isActiveCart && savedShipDate) {
            return <SelectedShipDate shipDate={ new Date(`${savedShipDate}`) } />
        }
    }

    const renderArrivalDate = () => {
        var savedArrivalDate
        savedArrivalDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_38')
        savedArrivalDate = savedArrivalDate?.fieldValue
        // if (arrivalDate.getYear() !== 69) {
        //     return <ArrivalDate arrivalDate={ arrivalDate } />
        // } 
        if (isActiveCart && savedArrivalDate) {
            return <ArrivalDate arrivalDate={ new Date(`${savedArrivalDate}`) } />
        }
    }

    const renderGiftMessage = () => {
        var savedGiftMessage
        savedGiftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_32')
        savedGiftMessage = savedGiftMessage?.fieldValue
        return giftMessage.length > 0
        ? giftMessage
        : ( isActiveCart && savedGiftMessage.length > 0 
        ? savedGiftMessage
        : '' )
    }

    return(
        <div className="shipping-summary-container">
            {renderShipDate()}
            {renderArrivalDate()}
            <GiftMessageSummary giftMessage={ renderGiftMessage() } />
        </div >
    )
}

export default ShippingSummary