import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import ArrivalDate from "../../shipping/customComponents/shipDate/ArrivalDate";
import GiftMessageSummary from "../../shipping/customComponents/giftOptions/GiftMessageSummary";

const ShippingSummary = (props: any) => {
    const { giftMessage, cart, consignment } = props

    var isActiveCart: boolean
    var savedCartID: { fieldValue: any; }
    // Development Custom Field
    // savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
    // Production Custom Field
    savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_49')
    isActiveCart = cart.id === savedCartID?.fieldValue

    const renderShipDate = () => {
        var savedShipDate
        // Development Custom Field
        // savedShipDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_30')
        // Production Custom Field
        savedShipDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_43')
        savedShipDate = savedShipDate?.fieldValue
        if (isActiveCart && savedShipDate) {
            return <SelectedShipDate shipDate={ new Date(`${savedShipDate}`) } />
        }
    }

    const renderArrivalDate = () => {
        var savedArrivalDate
        // Development Custom Field
        // savedArrivalDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_38')
        // Production Custom Field
        savedArrivalDate = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_47')
        savedArrivalDate = savedArrivalDate?.fieldValue
        if (isActiveCart && savedArrivalDate) {
            return <ArrivalDate arrivalDate={ new Date(`${savedArrivalDate}`) } />
        }
    }

    const renderGiftMessage = () => {
        var savedGiftMessage
        // Development Custom Field
        // savedGiftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_32')
        // Production Custom Field
        savedGiftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_45')
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