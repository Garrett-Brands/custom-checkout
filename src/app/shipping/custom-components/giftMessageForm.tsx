import React from "react";

const GiftMessageForm = (props: any) => {

    console.log(props)
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

    return(
        <div className="gift-message-form-testing">
            <h1>Gift Message Testing</h1>
        </div>
    )
}

export default GiftMessageForm