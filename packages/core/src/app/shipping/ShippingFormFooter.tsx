import React, { PureComponent, ReactNode } from 'react';
import { Consignment, Cart } from '@bigcommerce/checkout-sdk';

import { TranslatedString } from '../locale';
import { OrderComments } from '../orderComments';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { Fieldset, Legend } from '../ui/form';
import ShipDate from './customComponents/shipDate/ShipDate';
import ShipDateDisabled from './customComponents/shipDate/ShipDateDisabled';
import GiftMessage from './customComponents/giftOptions/GiftMessage';
import GiftMessageDisabled from './customComponents/giftOptions/GiftMessageDisabled';
import ShippingBanner from './customComponents/shipDate/ShippingBanner';

import { ShippingOptions } from './shippingOption';

export interface ShippingFormFooterProps {
    cart: Cart;
    cartHasChanged: boolean;
    isMultiShippingMode: boolean;
    shouldShowOrderComments: boolean;
    shouldShowShippingOptions?: boolean;
    shouldDisableSubmit: boolean;
    isLoading: boolean;
    consignments: Consignment[];
    shipDate: Date;
    setShipDate: Function;
    arrivalDate: Date;
    setArrivalDate: Function;
    giftMessage: String;
    setGiftMessage: Function;
}

interface ShippingFormFooterState {
    dateUnavailable: boolean;
    unavailableItems: Array<any>;
}

class ShippingFormFooter extends PureComponent<ShippingFormFooterProps, ShippingFormFooterState> {
    constructor(props: ShippingFormFooterProps) {
        super(props);
        this.state = {
            dateUnavailable: false,
            unavailableItems: []
        };
    }

    render(): ReactNode {
        const {
            cart,
            cartHasChanged,
            isMultiShippingMode,
            shouldShowOrderComments,
            shouldShowShippingOptions = true,
            shouldDisableSubmit,
            isLoading,
            consignments,
            shipDate,
            setShipDate,
            arrivalDate,
            setArrivalDate,
            giftMessage,
            setGiftMessage,
        } = this.props;

        if (cart && consignments[0]) {
            var isActiveCart
            var savedCartID
            savedCartID = consignments[0].shippingAddress.customFields.find((customField: { fieldId: string; }) => customField.fieldId === 'field_36')
            isActiveCart = cart.id === savedCartID?.fieldValue
        }

        const { dateUnavailable, unavailableItems } = this.state;

        const setDateUnavailable = (status: boolean) => {
            this.setState({dateUnavailable: status})
        }

        const setUnavailableItems = (unavailableItems: Array<any>) => {
            this.setState({unavailableItems: unavailableItems})
        }

        const renderItemAvailabilityMessage = (type: string) => {
            var message = [' no longer available. Please update your cart to complete your checkout.']
            var products = new Array
            unavailableItems.map((item: { name: string, options: any }) => {
                var options = new Array
                if (item.options.length > 0) {
                    item.options.map((option: any) => options.push(option.value))
                }
                options.unshift(item.name)
                products.push(options.join(' - '))
            })
            message.unshift(products.length > 1 ? ' product' : ' product')
            message.unshift(products.length.toString())
            return type === 'main'
            ? message
            : products.join(', ')
        }

        return <>
            <Fieldset
                id="checkout-shipping-options"
                legend={
                    <>
                        <Legend>
                            <TranslatedString id="shipping.shipping_method_label" />
                        </Legend>

                        { cartHasChanged &&
                            <Alert type={ AlertType.Error }>
                                <strong>
                                    <TranslatedString id="shipping.cart_change_error" />
                                </strong>
                            </Alert> }
                    </>
                }
            >
                <ShippingOptions
                    isMultiShippingMode={ isMultiShippingMode }
                    isUpdatingAddress={ isLoading }
                    shouldShowShippingOptions={ shouldShowShippingOptions }
                />
            </Fieldset>

            { shouldShowShippingOptions && unavailableItems.length === 0
            ?   <ShipDate
                    cart={ cart }
                    consignments={ consignments }
                    shipDate={ shipDate }
                    setShipDate={ setShipDate }
                    arrivalDate={ arrivalDate }
                    setArrivalDate={ setArrivalDate }
                    isActiveCart={ isActiveCart }
                    dateUnavailable={ dateUnavailable }
                    setDateUnvailable={ setDateUnavailable }
                    unavailableItems={ unavailableItems }
                    setUnavailableItems={ setUnavailableItems } /> 
            : <ShipDateDisabled /> }

            { unavailableItems.length > 0 &&
                <ShippingBanner
                    className='unavailable-items-alert-banner'
                    mainMessage={renderItemAvailabilityMessage('main')}
                    secondMessage={renderItemAvailabilityMessage('second')} />
            }

            { shouldShowShippingOptions && !dateUnavailable && unavailableItems.length === 0
            ?   <GiftMessage
                    consignments={ consignments }
                    giftMessage={ giftMessage }
                    setGiftMessage={ setGiftMessage }
                    isActiveCart={ isActiveCart } />
            :   <GiftMessageDisabled /> }

            { shouldShowOrderComments &&
                <OrderComments /> }

            <div className="form-actions">
                <Button
                    disabled={ shouldDisableSubmit || dateUnavailable || unavailableItems.length > 0 }
                    id="checkout-shipping-continue"
                    isLoading={ isLoading }
                    type="submit"
                    variant={ ButtonVariant.Primary }
                >
                    <TranslatedString id="common.continue_action" />
                </Button>
            </div>
        </>;
    }
}

export default ShippingFormFooter;
