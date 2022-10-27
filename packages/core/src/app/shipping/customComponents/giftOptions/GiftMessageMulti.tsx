import React, { useEffect, useState } from "react";
// import { Fieldset, Legend } from "../../../ui/form";
import GiftOptions from "./GiftOptions";
import GiftMessageToggle from "./GiftMessageToggle";
import GiftMessageForm from "./GiftMessageForm";
import GiftMessageDestination from "./GiftMessageDestination";

const GiftMessageMulti = (props: any) => {

    const {
        consignment,
        giftMessages,
        setGiftMessages,
        isActiveCart
     } = props

    const [giftMessageToggle, setGiftMessageToggle] = useState(false)
    const [giftMessage, setGiftMessage] = useState('')

    useEffect(() => {
        giftMessages.map((item: any) => {
            if (item.consignmentId === consignment.id && isActiveCart) {
                setGiftMessage(item.giftMessage)
                setGiftMessageToggle(item.giftMessage.length > 0)
            }
        })
    }, [])

    useEffect(() => {
        setGiftMessages({
            consignmentId: consignment.id,
            giftMessage: giftMessage
        })
    }, [giftMessage])

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