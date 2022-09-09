import React, { useEffect, useState } from "react";
import { Fieldset, Legend } from "../../../ui/form";
import GiftOptions from "./GiftOptions";
import GiftMessageToggle from "./GiftMessageToggle";
import GiftOrderForm from "./GiftOrderForm";
import GiftMessageForm from "./GiftMessageForm";

const GiftMessage = () => {

    const [isGiftOrder, setIsGiftOrder] = useState(false)
    const [giftMessageToggle, setGiftMessageToggle] = useState(false)
    const [giftMessage, setGiftMessage] = useState(String)
    const [giftMessageIncluded, setGiftMessageIncluded] = useState(Boolean)
    const [giftMessageLength, setGiftMessageLength] = useState(Number)

    useEffect(() => {
        if (!giftMessageToggle) {
            setGiftMessage('')
        }
        console.log('Gift Order?', isGiftOrder)
        console.log('Added Gift Message?', giftMessageToggle)
    }, [isGiftOrder, giftMessageToggle])

    useEffect(() => {
        setGiftMessageIncluded(giftMessage.length > 0)
        setGiftMessageLength(giftMessage.length)
    }, [giftMessage])

    useEffect(() => {
        console.log('Gift Message Included?', giftMessageIncluded)
    }, [giftMessageIncluded])

    // var checkoutId = props.id
    // var giftMessageConsignmentID = `field_32`
    // const address = props.consignments[0].address
    // const { firstName, lastName, email, company, address1, address2, city, stateOrProvince, stateOrProvinceCode, countryCode, postalCode, phone, shouldSaveAddress } = address

    // var reqBody = [
    //     {
    //       "address": {
    //         "firstName": firstName,
    //         "lastName": lastName,
    //         "email": email,
    //         "company": company,
    //         "address1": address1,
    //         "address2": address2,
    //         "city": city,
    //         "stateOrProvince": stateOrProvince,
    //         "stateOrProvinceCode": stateOrProvinceCode,
    //         "countryCode": countryCode,
    //         "postalCode": postalCode,
    //         "phone": phone,
    //         "customFields": [
    //           {
    //             "fieldId": giftMessageConsignmentID,
    //             "fieldValue": "Hi I'm testing adding a gift message!"
    //           }
    //         ],
    //         "shouldSaveAddress": shouldSaveAddress
    //       },
    //       "lineItems": [
    //         {
    //           "itemId": "bc86373a-4799-42b0-8e13-12e4c920fea4",
    //           "quantity": 2
    //         }
    //       ]
    //     }
    //   ]

    // var reqObj = {
    //     method: 'POST',
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Accept": "application/json",
    //       "X-Auth-Client": "e7cg7imo0dzsaanp1p4nd5eex92e43b",
    //       "X-Auth-Token": "3n66or96s8h3yfrmwif209l225mh74"
    //     },
    //     "body": JSON.stringify(reqBody)
    // };
    
    // const createGiftMessage = () => fetch(`https://api.bigcommerce.com/stores/b9domrfuy0/v3/checkouts/${checkoutId}/consignments?includes=consignments.availableShippingOptions`, reqObj)

    // createGiftMessage()
    // .then(resp => resp.json())
    // .then(shipments => {
    //     debugger
    //     console.log(shipments)
    // })
    // .catch(error => {
    //     console.log(error)
    // })

    const handleToggle = () => {
        setGiftMessageToggle(!giftMessageToggle)
    }

    return(
        <Fieldset id='gift-message'>
            <Legend testId="gift-message-form-heading"><span>Gift Options</span></Legend>
            <GiftOptions>
                <GiftOrderForm setIsGiftOrder={ setIsGiftOrder } />
                        <GiftMessageToggle 
                            toggleGiftMessage={ handleToggle } 
                            giftMessageToggle={ giftMessageToggle }
                            giftMessageLength={ giftMessageLength } />
                        { giftMessageToggle && <GiftMessageForm setGiftMessage={setGiftMessage} /> }
            </GiftOptions>
        </Fieldset>
    )
}

export default GiftMessage