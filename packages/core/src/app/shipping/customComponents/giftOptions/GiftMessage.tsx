import React, { useEffect, useState } from "react";
import { Fieldset, Legend } from "../../../ui/form";
import GiftOptions from "./GiftOptions";
import GiftMessageToggle from "./GiftMessageToggle";
import GiftMessageForm from "./GiftMessageForm";

const GiftMessage = (props: any) => {

    const {
        consignments, 
        giftMessage, 
        setGiftMessage,
        isActiveCart
     } = props

    const customFields = consignments[0]?.shippingAddress.customFields.length > 0
    const [giftMessageToggle, setGiftMessageToggle] = useState(false)

    useEffect(() => {
        var savedGiftMessage
        if (customFields && isActiveCart) {
            // Development Custom Field
            savedGiftMessage = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string, fieldValue: string }) => customField.fieldId === 'field_32')
            // Production Custom Field
            // savedGiftMessage = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string, fieldValue: string }) => customField.fieldId === 'field_45')
            savedGiftMessage = savedGiftMessage.fieldValue
            setGiftMessage(savedGiftMessage)
            setGiftMessageToggle(savedGiftMessage.length > 0)
        }
    }, [])

    const handleToggle = () => {
        setGiftMessageToggle(!giftMessageToggle)
    }

    const handleClear = () => {
        setGiftMessage('')
        setGiftMessageToggle(true)
    }

    return(
        <Fieldset id='gift-message'>
            <Legend testId="gift-message-form-heading"><span>Gift Options</span></Legend>
            <GiftOptions className='gift-options-container'>
                <GiftMessageToggle 
                    toggleGiftMessage={ handleToggle } 
                    giftMessageToggle={ giftMessageToggle }
                    giftMessageLength={ giftMessage.length }
                    clearGiftMessage={ handleClear } />

                { giftMessageToggle && 
                <GiftMessageForm 
                    setGiftMessage={ setGiftMessage }
                    giftMessage={ giftMessage } /> }
            </GiftOptions>
        </Fieldset>
    )
}

export default GiftMessage