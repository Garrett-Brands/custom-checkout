import React, { PureComponent, ReactNode } from 'react';
import { Consignment } from '@bigcommerce/checkout-sdk';

import { TranslatedString } from '../locale';
import { OrderComments } from '../orderComments';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { Fieldset, Legend } from '../ui/form';
import ShipDate from './customComponents/shipDate/ShipDate';
import ShipDateDisabled from './customComponents/shipDate/ShipDateDisabled';
import GiftMessage from './customComponents/giftOptions/GiftMessage';
import GiftMessageDisabled from './customComponents/giftOptions/GiftMessageDisabled';

import { ShippingOptions } from './shippingOption';

export interface ShippingFormFooterProps {
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
    isGiftOrder: boolean;
    setIsGiftOrder: Function;
}

class ShippingFormFooter extends PureComponent<ShippingFormFooterProps> {
    render(): ReactNode {
        const {
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
            isGiftOrder,
            setIsGiftOrder
        } = this.props;

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

            { shouldShowShippingOptions 
            ?   <ShipDate 
                    consignments={ consignments }
                    shipDate={ shipDate }
                    setShipDate={ setShipDate }
                    arrivalDate={ arrivalDate }
                    setArrivalDate={ setArrivalDate } /> 
            : <ShipDateDisabled /> }

            { shouldShowShippingOptions
            ?   <GiftMessage
                    consignments={ consignments }
                    giftMessage={ giftMessage }
                    setGiftMessage={ setGiftMessage }
                    isGiftOrder={ isGiftOrder }
                    setIsGiftOrder={ setIsGiftOrder } />
            :   <GiftMessageDisabled /> }

            { shouldShowOrderComments &&
                <OrderComments /> }

            <div className="form-actions">
                <Button
                    disabled={ shouldDisableSubmit }
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
