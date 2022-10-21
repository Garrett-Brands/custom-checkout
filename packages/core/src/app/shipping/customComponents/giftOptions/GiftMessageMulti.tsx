import React, { useEffect, useState } from "react";
// import { Fieldset, Legend } from "../../../ui/form";
import GiftOptions from "./GiftOptions";
import GiftMessageToggle from "./GiftMessageToggle";
import GiftMessageForm from "./GiftMessageForm";
import GiftMessageDestination from "./GiftMessageDestination";

const GiftMessageMulti = (props: any) => {

    const {
        consignment,
        // giftMessage,
        // setGiftMessage,
        isActiveCart
     } = props

    const customFields = consignment?.shippingAddress.customFields.length > 0
    const [giftMessageToggle, setGiftMessageToggle] = useState(false)
    const [giftMessage, setGiftMessage] = useState('')

    useEffect(() => {
        var savedGiftMessage
        if (customFields && isActiveCart) {
            savedGiftMessage = consignment.shippingAddress.customFields.find((customField: { fieldId: string, fieldValue: string }) => customField.fieldId === 'field_32')
            if (savedGiftMessage) {
                savedGiftMessage = savedGiftMessage.fieldValue
                setGiftMessage(savedGiftMessage)
            }
        }
    }, [])
    
    useEffect(() => {
        setGiftMessageToggle(giftMessage.length > 0)
    }, [])

    const handleToggle = () => {
        setGiftMessageToggle(!giftMessageToggle)
    }

    const handleClear = () => {
        setGiftMessage('')
        setGiftMessageToggle(true)
    }

    return(
        <GiftOptions className='gift-options-multi-container'>
            <GiftMessageDestination shippingAddress={ consignment.shippingAddress } />
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
    )
}

export default GiftMessageMulti