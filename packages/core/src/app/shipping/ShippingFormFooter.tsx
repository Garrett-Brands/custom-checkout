import { Cart, Consignment, ExtensionRegion } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { ExtensionRegionContainer, useExtensions } from '@bigcommerce/checkout/checkout-extension';
import { TranslatedString } from '@bigcommerce/checkout/locale';

import { OrderComments } from '../orderComments';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { Fieldset, Legend } from '../ui/form';

import GiftMessage from './customComponents/giftOptions/GiftMessage';
import GiftMessageDisabled from './customComponents/giftOptions/GiftMessageDisabled';
import GiftMessageMulti from './customComponents/giftOptions/GiftMessageMulti';
import ShipDate from './customComponents/shipDate/ShipDate';
import ShipDateDisabled from './customComponents/shipDate/ShipDateDisabled';
import ShippingBanner from './customComponents/shipDate/ShippingBanner';
import { ShippingOptions } from './shippingOption';
// import ShippingAcknowledgment from './customComponents/shippingAcknowledgement/ShippingAcknowledgement';

export interface ShippingFormFooterProps {
    readonly cart: Cart;
    readonly cartHasChanged: boolean;
    readonly isMultiShippingMode: boolean;
    readonly shouldShowOrderComments: boolean;
    readonly shouldShowShippingOptions?: boolean;
    readonly shouldDisableSubmit: boolean;
    readonly isLoading: boolean;
    readonly shipDate: Date;
    readonly setShipDate: Function;
    readonly arrivalDate: Date;
    readonly setArrivalDate: Function;
    readonly giftMessage: string;
    readonly setGiftMessage: Function;
    readonly giftMessages: any[];
    readonly setGiftMessages: Function;
    readonly consignments: Consignment[];
}

const ShippingFormFooter: FunctionComponent<ShippingFormFooterProps> = ({
    cartHasChanged,
    isMultiShippingMode,
    shouldShowOrderComments,
    shouldShowShippingOptions = true,
    shouldDisableSubmit,
    isLoading,
    cart,
    shipDate,
    setShipDate,
    arrivalDate,
    setArrivalDate,
    giftMessage,
    setGiftMessage,
    giftMessages,
    setGiftMessages,
    consignments,
}) => {
    const { extensionService, isExtensionEnabled } = useExtensions();
    const isExtensionRegionEnabled = Boolean(
        isExtensionEnabled() &&
            extensionService.isRegionEnabled(ExtensionRegion.ShippingShippingAddressFormAfter),
    );

    const [unavailableItems, setUnavailableItems] = useState([]);
    const [itemsUnavailableToShip, setItemsUnavailableToShip] = useState([]);
    // const [shippingAcknowledged, setShippingAcknowledged] = useState(false);

    // Code Prior to August 23 Merge

    // interface ShippingFormFooterState {
    //     unavailableItems: Array<any>;
    //     itemsUnavailableToShip: Array<any>;
    //     shippingAcknowledged: boolean;
    // }

    if (cart && consignments[0]) {
        var isActiveCart
        let savedCartID

        // Development Custom Field
        savedCartID = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
        // Production Custom Field
        // savedCartID = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_49')
        isActiveCart = cart.id === savedCartID?.fieldValue
    }

    useEffect(() => {
        if (isExtensionRegionEnabled) {
            void extensionService.renderExtension(
                ExtensionRegionContainer.ShippingShippingAddressFormAfter,
                ExtensionRegion.ShippingShippingAddressFormAfter,
            );

            return () => {
                extensionService.removeListeners(ExtensionRegion.ShippingShippingAddressFormAfter);
            };
        }
    }, [extensionService, isExtensionRegionEnabled]);

    // const renderItemAvailabilityMessage = (type: string) => {
    //     const message = ['no longer available. Please update your cart to complete checkout.']
    //     const products = []

    //     unavailableItems.map((item: { name: string, options: any }) => {
    //         const options = []

    //         if (item.options.length > 0) {
    //             item.options.map((option: any) => options.push(option.value))
    //         }

    //         options.unshift(item.name)

    //         const productDetails = { message: options.join(' - ') }

    //         products.push(productDetails)
    //     })
    //     message.unshift(products.length > 1 ? ' products are ' : ' product is ')
    //     message.unshift(products.length.toString())

    //     return type === 'main'
    //     ? message
    //     : products
    // }

    // const includesFrangoItems = () => {
    //     let includesFrangoItems = false

    //     cart.lineItems.physicalItems.map(item => { if (item.categoryNames?.includes('Frango Chocolate')) includesFrangoItems = true })

    //     return includesFrangoItems
    // }

    const shippingSurchargeMessage = 'UPS increased their shipping prices, resulting in a holiday surcharge per item.'
    const surchargeIsActive = false
        
    // const shouldDisableContinue = () => {
    //     // Disable shipping continue if there are unavailable items, items unavailable to ship, or Frango and fan hasn't acknowledged warm shipping.
    //     return unavailableItems.length > 0 || itemsUnavailableToShip.length > 0 || ( includesFrangoItems() && shippingAcknowledged === false )
    // };

    const renderGiftMessageMulti = (consignment: Consignment, index: number) => {
        if (cart && consignment) {
            var isActiveCart
            let savedCartID

            // Development Custom Field
            savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
            // Production Custom Field
            // savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_49')
            isActiveCart = cart.id === savedCartID?.fieldValue
        }

        return (
            <GiftMessageMulti
                consignment={ consignment }
                giftMessages={ giftMessages }
                isActiveCart={ isActiveCart }
                key={index}
                setGiftMessages={ setGiftMessages } />
        )
    }

    return (
        <>
            {isExtensionRegionEnabled && (
                <div id={ExtensionRegionContainer.ShippingShippingAddressFormAfter} />
            )}
            <Fieldset
                id="checkout-shipping-options"
                legend={
                    <>
                        <Legend>
                            <TranslatedString id="shipping.shipping_method_label" />
                        </Legend>

                        {cartHasChanged && (
                            <Alert type={AlertType.Error}>
                                <strong>
                                    <TranslatedString id="shipping.cart_change_error" />
                                </strong>
                            </Alert>
                        )}
                    </>
                }
            >
                { surchargeIsActive &&
                    <ShippingBanner
                        className='shipping-surcharge-banner'
                        mainMessage='?'
                        secondMessage={shippingSurchargeMessage}
                    />
                }
                <ShippingOptions
                    isMultiShippingMode={isMultiShippingMode}
                    isUpdatingAddress={isLoading}
                    shouldShowShippingOptions={shouldShowShippingOptions}
                />
                {/* Seasonal Frango Chocolate Shipping Acknowledgement */}
                {/* { includesFrangoItems() && <ShippingAcknowledgment 
                                                setShippingAcknowledged={setShippingAcknowledged}
                                                shippingAcknowledged={shippingAcknowledged} /> } */}
                
            </Fieldset>

            { shouldShowShippingOptions
            // { shouldShowShippingOptions && unavailableItems.length === 0
            ?   <ShipDate
                    arrivalDate={ arrivalDate }
                    cart={ cart }
                    consignments={ consignments }
                    isActiveCart={ isActiveCart }
                    isMultiShippingMode={ isMultiShippingMode }
                    itemsUnavailableToShip={ itemsUnavailableToShip }
                    setArrivalDate={ setArrivalDate }
                    setItemsUnavailableToShip={ setItemsUnavailableToShip }
                    setShipDate={ setShipDate }
                    setUnavailableItems={ setUnavailableItems }
                    shipDate={ shipDate }
                    unavailableItems={ unavailableItems } /> 
            : <ShipDateDisabled /> }


            {/* Optional Inventory Banner */}
            {/* { unavailableItems.length > 0 &&
                <ShippingBanner
                    className='unavailable-items-alert-banner'
                    listItems={renderItemAvailabilityMessage('second')}
                    mainMessage={renderItemAvailabilityMessage('main')} />
            } */}

            { shouldShowShippingOptions 
            // && unavailableItems.length === 0
            && itemsUnavailableToShip.length === 0
            && !isMultiShippingMode
            ?   <GiftMessage
                    consignments={ consignments }
                    giftMessage={ giftMessage }
                    isActiveCart={ isActiveCart }
                    setGiftMessage={ setGiftMessage } />
            : ( isMultiShippingMode
            ? <>
                <Fieldset id='gift-message'>
                    <Legend testId="gift-message-form-heading"><span>Gift Options</span></Legend>
                </Fieldset>
                    {consignments.map((consignment, index) => renderGiftMessageMulti(consignment, index))}
              </>
            : <GiftMessageDisabled /> ) }

            {shouldShowOrderComments && <OrderComments />}

            <div className="form-actions">
                <Button
                    // disabled={ shouldDisableSubmit || unavailableItems.length > 0 || itemsUnavailableToShip.length > 0 || shouldDisableContinue() }
                    disabled={ shouldDisableSubmit || itemsUnavailableToShip.length > 0 }
                    id="checkout-shipping-continue"
                    isLoading={isLoading}
                    type="submit"
                    variant={ButtonVariant.Primary}
                >
                    <TranslatedString id="common.continue_action" />
                </Button>
            </div>
        </>
    );
};

// Code Prior to August 23 Merge

// private renderGiftMessageMulti(consignment: Consignment, index: number): ReactNode {
//     const { 
//         cart,
//         giftMessages,
//         setGiftMessages
//     } = this.props;

//     if (cart && consignment) {
//         var isActiveCart
//         var savedCartID
//         savedCartID = consignment.shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
//         isActiveCart = cart.id === savedCartID?.fieldValue
//     }

//     return (
//         <GiftMessageMulti
//             key={index}
//             consignment={ consignment }
//             isActiveCart={ isActiveCart }
//             giftMessages={ giftMessages }
//             setGiftMessages={ setGiftMessages } />
//     );
// }

export default ShippingFormFooter;
