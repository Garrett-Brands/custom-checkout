import React from "react";
import SelectedShipDate from "../../shipping/customComponents/shipDate/SelectedShipDate";
import GiftMessageSummary from "../../shipping/customComponents/giftOptions/GiftMessageSummary";

const ShippingSummaryMulti = (props: any) => {
    const { cart, consignment } = props

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

    const renderGiftMessage = () => {
        var giftMessage
        // Development Custom Field
        // giftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_32')
        // Production Custom Field
        giftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_45')
        giftMessage = giftMessage?.fieldValue
        return isActiveCart
        ? giftMessage
        : ''
    }

    return(
        <div className="shipping-summary-container">
            {renderShipDate()}
            <GiftMessageSummary giftMessage={ renderGiftMessage() } />
        </div >
    )
}

export default ShippingSummaryMulti