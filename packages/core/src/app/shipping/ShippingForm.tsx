import {
    Address,
    AddressRequestBody,
    Cart,
    CheckoutParams,
    CheckoutSelectors,
    Consignment,
    ConsignmentAssignmentRequestBody,
    Country,
    CustomerAddress,
    CustomerRequestOptions,
    FormField,
    RequestOptions,
    ShippingInitializeOptions,
    ShippingRequestOptions,
} from '@bigcommerce/checkout-sdk';
import React, { Component, ReactNode } from 'react';

import { withLanguage, WithLanguageProps } from '../locale';

import MultiShippingForm, { MultiShippingFormValues } from './MultiShippingForm';
import SingleShippingForm, { SingleShippingFormValues } from './SingleShippingForm';

export interface ShippingFormProps {
    addresses: CustomerAddress[];
    cart: Cart;
    cartHasChanged: boolean;
    consignments: Consignment[];
    countries: Country[];
    countriesWithAutocomplete: string[];
    customerMessage: string;
    googleMapsApiKey?: string;
    isBillingSameAsShipping: boolean;
    isGuest: boolean;
    isLoading: boolean;
    isShippingStepPending: boolean;
    isMultiShippingMode: boolean;
    methodId?: string;
    shippingAddress?: Address;
    shouldShowSaveAddress?: boolean;
    shouldShowOrderComments: boolean;
    shouldShowAddAddressInCheckout: boolean;
    isFloatingLabelEnabled?: boolean;
    assignItem(consignment: ConsignmentAssignmentRequestBody): Promise<CheckoutSelectors>;
    deinitialize(options: ShippingRequestOptions): Promise<CheckoutSelectors>;
    deleteConsignments(): Promise<Address | undefined>;
    getFields(countryCode?: string): FormField[];
    initialize(options: ShippingInitializeOptions): Promise<CheckoutSelectors>;
    onCreateAccount(): void;
    createCustomerAddress(address: AddressRequestBody): Promise<CheckoutSelectors>;
    onMultiShippingSubmit(values: MultiShippingFormValues): void;
    onSignIn(): void;
    onSingleShippingSubmit(values: SingleShippingFormValues): void;
    onUnhandledError(error: Error): void;
    onUseNewAddress(address: Address, itemId: string): void;
    signOut(options?: CustomerRequestOptions): void;
    updateAddress(
        address: Partial<Address>,
        options: RequestOptions<CheckoutParams>,
    ): Promise<CheckoutSelectors>;
    shipDate: Date;
    setShipDate: Function;
    arrivalDate: Date;
    setArrivalDate: Function;
    giftMessage: String;
    setGiftMessage: Function;
    giftMessages: Array<any>;
    setGiftMessages: Function;
    loadGiftMessages: Function;
    isGiftOrder: boolean;
    setIsGiftOrder: Function;
}

class ShippingForm extends Component<ShippingFormProps & WithLanguageProps> {
    render(): ReactNode {
        const {
            addresses,
            assignItem,
            cart,
            cartHasChanged,
            createCustomerAddress,
            consignments,
            countries,
            countriesWithAutocomplete,
            onCreateAccount,
            customerMessage,
            deinitialize,
            deleteConsignments,
            getFields,
            googleMapsApiKey,
            initialize,
            isBillingSameAsShipping,
            isGuest,
            isLoading,
            isMultiShippingMode,
            methodId,
            onMultiShippingSubmit,
            onSignIn,
            onSingleShippingSubmit,
            onUnhandledError,
            onUseNewAddress,
            shippingAddress,
            shouldShowOrderComments,
            shouldShowSaveAddress,
            shouldShowAddAddressInCheckout,
            signOut,
            updateAddress,
            isShippingStepPending,
            shipDate,
            setShipDate,
            arrivalDate,
            setArrivalDate,
            giftMessage,
            setGiftMessage,
            giftMessages,
            setGiftMessages,
            loadGiftMessages,
            isGiftOrder,
            setIsGiftOrder,
            isFloatingLabelEnabled,
        } = this.props;

        return isMultiShippingMode ? (
            <MultiShippingForm
                addresses={ addresses }
                assignItem={ assignItem }
                cart={ cart }
                cartHasChanged={ cartHasChanged }
                consignments={ consignments }
                countries={ countries }
                countriesWithAutocomplete={ countriesWithAutocomplete }
                createCustomerAddress={ createCustomerAddress }
                customerMessage={ customerMessage }
                defaultCountryCode={ shippingAddress?.countryCode }
                getFields={ getFields }
                googleMapsApiKey={ googleMapsApiKey }
                isGuest={ isGuest }
                isLoading={ isLoading }
                onCreateAccount={ onCreateAccount }
                onSignIn={ onSignIn }
                onSubmit={ onMultiShippingSubmit }
                onUnhandledError={ onUnhandledError }
                onUseNewAddress={ onUseNewAddress }
                shouldShowAddAddressInCheckout={ shouldShowAddAddressInCheckout }
                shouldShowOrderComments={ shouldShowOrderComments }
                shipDate={ shipDate }
                setShipDate={ setShipDate }
                arrivalDate={ arrivalDate }
                setArrivalDate={ setArrivalDate }
                giftMessages={ giftMessages }
                setGiftMessages={ setGiftMessages }
                loadGiftMessages={ loadGiftMessages }
            />
        ) : (
            <SingleShippingForm
                addresses={ addresses }
                cart={ cart }
                cartHasChanged={ cartHasChanged }
                consignments={ consignments }
                countries={ countries }
                countriesWithAutocomplete={ countriesWithAutocomplete }
                customerMessage={ customerMessage }
                deinitialize={ deinitialize }
                deleteConsignments={ deleteConsignments }
                getFields={ getFields }
                googleMapsApiKey={ googleMapsApiKey }
                initialize={ initialize }
                isBillingSameAsShipping={ isBillingSameAsShipping }
                isLoading={ isLoading }
                isMultiShippingMode={ isMultiShippingMode }
                isShippingStepPending={ isShippingStepPending }
                methodId={ methodId }
                onSubmit={ onSingleShippingSubmit }
                onUnhandledError={ onUnhandledError }
                shippingAddress={ shippingAddress }
                shouldShowOrderComments={ shouldShowOrderComments }
                shouldShowSaveAddress={ shouldShowSaveAddress }
                signOut={ signOut }
                updateAddress={ updateAddress }
                isFloatingLabelEnabled={isFloatingLabelEnabled}
                shipDate={ shipDate }
                setShipDate={ setShipDate }
                arrivalDate={ arrivalDate }
                setArrivalDate={ setArrivalDate }
                giftMessage={ giftMessage }
                setGiftMessage={ setGiftMessage }
                isGiftOrder={ isGiftOrder }
                setIsGiftOrder={ setIsGiftOrder }
                giftMessages={ giftMessages }
                setGiftMessages={ setGiftMessages }
            />
        );
    }
}

export default withLanguage(ShippingForm);
