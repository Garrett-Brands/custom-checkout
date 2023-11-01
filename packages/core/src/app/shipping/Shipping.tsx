import { 
    Address, 
    AddressRequestBody, 
    Cart, 
    CheckoutRequestBody, 
    CheckoutSelectors, 
    Consignment, 
    ConsignmentAssignmentRequestBody, 
    ConsignmentUpdateRequestBody, 
    Country, 
    Customer, 
    CustomerRequestOptions, 
    FormField, 
    ShippingInitializeOptions, 
    ShippingRequestOptions 
} from '@bigcommerce/checkout-sdk';
import { noop } from 'lodash';
import React, { Component, ReactNode } from 'react';
import { createSelector } from 'reselect';

import { CheckoutContextProps } from '@bigcommerce/checkout/payment-integration-api';
import { AddressFormSkeleton } from '@bigcommerce/checkout/ui';

import { isEqualAddress, mapAddressFromFormValues } from '../address';
import { withCheckout } from '../checkout';
import CheckoutStepStatus from '../checkout/CheckoutStepStatus';
import { EMPTY_ARRAY, isFloatingLabelEnabled } from '../common/utility';
import { PaymentMethodId } from '../payment/paymentMethod';

import { UnassignItemError } from './errors';
import findLineItems from './findLineItems';
import getShippableItemsCount from './getShippableItemsCount';
import getShippingMethodId from './getShippingMethodId';
import { MultiShippingFormValues } from './MultiShippingForm';
import ShippingForm from './ShippingForm';
import ShippingHeader from './ShippingHeader';
import { SingleShippingFormValues } from './SingleShippingForm';
import ShippingBanner from './customComponents/shipDate/ShippingBanner';
import StripeShipping from './stripeUPE/StripeShipping';

export interface ShippingProps {
    isBillingSameAsShipping: boolean;
    cartHasChanged: boolean;
    isMultiShippingMode: boolean;
    step: CheckoutStepStatus;
    onCreateAccount(): void;
    onToggleMultiShipping(): void;
    onReady?(): void;
    onUnhandledError(error: Error): void;
    onSignIn(): void;
    navigateNextStep(isBillingSameAsShipping: boolean): void;
    shipDate: Date;
    setShipDate: Function;
    arrivalDate: Date;
    setArrivalDate: Function;
    giftMessage: String;
    setGiftMessage: Function;
}

export interface WithCheckoutShippingProps {
    billingAddress?: Address;
    cart: Cart;
    consignments: Consignment[];
    countries: Country[];
    countriesWithAutocomplete: string[];
    customer: Customer;
    customerMessage: string;
    googleMapsApiKey: string;
    isGuest: boolean;
    isInitializing: boolean;
    isLoading: boolean;
    isShippingStepPending: boolean;
    methodId?: string;
    shippingAddress?: Address;
    shouldShowAddAddressInCheckout: boolean;
    shouldShowMultiShipping: boolean;
    shouldShowOrderComments: boolean;
    providerWithCustomCheckout?: string;
    isFloatingLabelEnabled?: boolean;
    assignItem(consignment: ConsignmentAssignmentRequestBody): Promise<CheckoutSelectors>;
    deinitializeShippingMethod(options: ShippingRequestOptions): Promise<CheckoutSelectors>;
    deleteConsignments(): Promise<Address | undefined>;
    getFields(countryCode?: string): FormField[];
    initializeShippingMethod(options: ShippingInitializeOptions): Promise<CheckoutSelectors>;
    loadShippingAddressFields(): Promise<CheckoutSelectors>;
    loadShippingOptions(): Promise<CheckoutSelectors>;
    signOut(options?: CustomerRequestOptions): void;
    createCustomerAddress(address: AddressRequestBody): Promise<CheckoutSelectors>;
    unassignItem(consignment: ConsignmentAssignmentRequestBody): Promise<CheckoutSelectors>;
    updateBillingAddress(address: Partial<Address>): Promise<CheckoutSelectors>;
    updateCheckout(payload: CheckoutRequestBody): Promise<CheckoutSelectors>;
    updateShippingAddress(address: Partial<Address>): Promise<CheckoutSelectors>;
    updateConsignment(consignment: ConsignmentUpdateRequestBody): Promise<CheckoutSelectors>;
    loadPaymentMethods(): Promise<CheckoutSelectors>;
}

interface ShippingState {
    isInitializing: boolean;
    isGiftOrder: boolean;
    giftMessages: Array<any>;
}

class Shipping extends Component<ShippingProps & WithCheckoutShippingProps, ShippingState> {
    constructor(props: ShippingProps & WithCheckoutShippingProps) {
        super(props);

        this.state = {
            isInitializing: true,
            isGiftOrder: false,
            giftMessages: new Array
        };
    }

    async componentDidMount(): Promise<void> {
        const {
            loadShippingAddressFields,
            loadShippingOptions,
            onReady = noop,
            onUnhandledError = noop,
        } = this.props;

        var toggleMulti = false
        this.loadGiftMessages(toggleMulti)

        try {
            await Promise.all([loadShippingAddressFields(), loadShippingOptions()]);

            onReady();
        } catch (error) {
            onUnhandledError(error);
        } finally {
            this.setState({ isInitializing: false });
        }
    }

    render(): ReactNode {
        const {
            isBillingSameAsShipping,
            isGuest,
            shouldShowMultiShipping,
            customer,
            unassignItem,
            updateShippingAddress,
            updateConsignment,
            initializeShippingMethod,
            deinitializeShippingMethod,
            isMultiShippingMode,
            onToggleMultiShipping,
            shipDate,
            setShipDate,
            arrivalDate,
            setArrivalDate,
            giftMessage,
            setGiftMessage,
            // isStripeLinkEnabled,
            providerWithCustomCheckout,
            step,
            isFloatingLabelEnabled,
            ...shippingFormProps
        } = this.props;

        const {
            isInitializing,
            isGiftOrder,
            giftMessages
        } = this.state;

        if (providerWithCustomCheckout === PaymentMethodId.StripeUPE && !customer.email && this.props.countries.length > 0) {
            return <StripeShipping
                { ...shippingFormProps }
                customer={ customer }
                deinitialize={deinitializeShippingMethod}
                initialize={initializeShippingMethod}
                isBillingSameAsShipping={isBillingSameAsShipping}
                isGuest={ isGuest }
                isLoading={ isInitializing }
                isMultiShippingMode={isMultiShippingMode}
                isShippingMethodLoading={ this.props.isLoading }
                onMultiShippingChange={ this.handleMultiShippingModeSwitch }
                onSubmit={this.handleSingleShippingSubmit}
                shouldShowMultiShipping={ shouldShowMultiShipping }
                step={step}
                updateAddress={updateShippingAddress}
            />;
        }

        const setIsGiftOrder = (isGiftOrder: boolean) => {
            this.setState({isGiftOrder: isGiftOrder})
        }

        const setGiftMessages = (giftMessage: any) => {
            var updatedGiftMessages = giftMessages
            updatedGiftMessages.map(item => {
                if (item.consignmentId === giftMessage.consignmentId) {
                    item.giftMessage = giftMessage.giftMessage
                }
            })
            this.setState({ giftMessages: updatedGiftMessages })
        }

        return (
            <AddressFormSkeleton isLoading={isInitializing}>
                <div className="checkout-form">
                    { isMultiShippingMode && !isGuest &&
                        <ShippingBanner
                            className='multi-ship-alert-banner'
                            mainMessage={'You may experience increased screen loading times for orders with multiple destinations.'}
                        />
                    }
                    <ShippingHeader
                        isGuest={isGuest}
                        isMultiShippingMode={isMultiShippingMode}
                        onMultiShippingChange={this.handleMultiShippingModeSwitch}
                        shouldShowMultiShipping={shouldShowMultiShipping}
                    />
                    <ShippingForm
                        {...shippingFormProps}
                        addresses={customer.addresses}
                        deinitialize={deinitializeShippingMethod}
                        initialize={initializeShippingMethod}
                        isBillingSameAsShipping={isBillingSameAsShipping}
                        isFloatingLabelEnabled={isFloatingLabelEnabled}
                        isGuest={isGuest}
                        isMultiShippingMode={isMultiShippingMode}
                        onMultiShippingSubmit={this.handleMultiShippingSubmit}
                        onSingleShippingSubmit={this.handleSingleShippingSubmit}
                        onUseNewAddress={this.handleUseNewAddress}
                        shouldShowSaveAddress={!isGuest}
                        updateAddress={updateShippingAddress}
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
                        loadGiftMessages={ this.loadGiftMessages }
                    />
                </div>
            </AddressFormSkeleton>
        );
    }

    private loadGiftMessages: (toggleMulti: boolean) => void = async (toggleMulti: boolean) => {
        const {
            consignments,
            isMultiShippingMode
        } = this.props

        var giftMessages = new Array

        if (isMultiShippingMode || toggleMulti) {
            consignments.map((consignment: Consignment) => {
                var giftMessage
                var consignmentId
                // Development Custom Field
                // giftMessage = consignment.shippingAddress.customFields.find(customField => customField.fieldId === 'field_32')
                // Production Custom Field
                giftMessage = consignment.shippingAddress.customFields.find(customField => customField.fieldId === 'field_45')
                consignmentId = consignment.id
                if (consignmentId) {
                    giftMessages.push({
                        consignmentId: consignmentId,
                        giftMessage: giftMessage && giftMessage.fieldValue || ''
                    })
                }
            })
    
            this.setState({ giftMessages: giftMessages })
        }
    }

    private handleMultiShippingModeSwitch: () => void = async () => {
        const {
            consignments,
            isMultiShippingMode,
            onToggleMultiShipping = noop,
            onUnhandledError = noop,
            updateShippingAddress,
        } = this.props;

        if (isMultiShippingMode && consignments.length > 1) {
            this.setState({ isInitializing: true });

            try {
                // Collapse all consignments into one
                await updateShippingAddress(consignments[0].shippingAddress);
            } catch (error) {
                onUnhandledError(error);
            } finally {
                this.setState({ isInitializing: false });
            }
        }
        
        var toggleMulti = true
        this.loadGiftMessages(toggleMulti)
        onToggleMultiShipping();
    };

    private handleSingleShippingSubmit: (values: SingleShippingFormValues) => void = async ({
        billingSameAsShipping,
        shippingAddress: addressValues,
        orderComment,
    }) => {
        const {
            cart,
            customerMessage,
            updateCheckout,
            updateShippingAddress,
            updateBillingAddress,
            navigateNextStep,
            onUnhandledError,
            shippingAddress,
            billingAddress,
            methodId,
            shipDate,
            arrivalDate,
            giftMessage,
        } = this.props;

        const { isGiftOrder } = this.state;

        // CHECKOUT CUSTOM FIELDS
        // Update Ship Date, Arrival Date, Gift Message, Gift Order custom fields when shipping step is completed.

        if (addressValues) {
            const shipDateValue = shipDate.toLocaleDateString('en-US')
            const arrivalDateValue = arrivalDate.toLocaleDateString('en-US')
            const giftMessageValue = giftMessage.toString()
            const cartID = cart.id
            // Development Custom Fields
            // addressValues.customFields.field_30 = shipDateValue
            // addressValues.customFields.field_38 = arrivalDateValue
            // addressValues.customFields.field_32 = giftMessageValue
            // isGiftOrder ? addressValues.customFields.field_34 = ['0'] : addressValues.customFields.field_34 = []
            // addressValues.customFields.field_36 = cartID
            // Production Custom Fields
            addressValues.customFields.field_43 = shipDateValue
            addressValues.customFields.field_47 = arrivalDateValue
            addressValues.customFields.field_45 = giftMessageValue
            isGiftOrder ? addressValues.customFields.field_51 = ['0'] : addressValues.customFields.field_51 = []
            addressValues.customFields.field_49 = cartID
        }

        const updatedShippingAddress = addressValues && mapAddressFromFormValues(addressValues);
        const promises: Array<Promise<CheckoutSelectors>> = [];
        const hasRemoteBilling = this.hasRemoteBilling(methodId);

        if (!isEqualAddress(updatedShippingAddress, shippingAddress) || shippingAddress?.shouldSaveAddress !== updatedShippingAddress?.shouldSaveAddress) {
            promises.push(updateShippingAddress(updatedShippingAddress || {}));
        }

        if (
            billingSameAsShipping &&
            updatedShippingAddress &&
            !isEqualAddress(updatedShippingAddress, billingAddress) &&
            !hasRemoteBilling
        ) {
            promises.push(updateBillingAddress(updatedShippingAddress));
        }

        if (customerMessage !== orderComment) {
            promises.push(updateCheckout({ customerMessage: orderComment }));
        }

        try {
            await Promise.all(promises);

            navigateNextStep(billingSameAsShipping);
        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(error);
            }
        }
    };

    private hasRemoteBilling: (methodId?: string) => boolean = (methodId) => {
        const PAYMENT_METHOD_VALID = ['amazonpay'];

        return PAYMENT_METHOD_VALID.some((method) => method === methodId);
    };

    private handleUseNewAddress: (address: Address, itemId: string) => void = async (
        address,
        itemId,
    ) => {
        const { unassignItem, onUnhandledError, isMultiShippingMode } = this.props;

        try {
            await unassignItem({
                address,
                lineItems: [
                    {
                        quantity: 1,
                        itemId,
                    },
                ],
            });

            location.href = '/account.php?action=add_shipping_address&from=checkout';
        } catch (error) {
            if (error instanceof UnassignItemError) {
                onUnhandledError(new UnassignItemError(error));
            }
        }

        this.loadGiftMessages(isMultiShippingMode)
    };

    private handleMultiShippingSubmit: (values: MultiShippingFormValues) => void = async ({
        orderComment,
    }) => {
        const {
            customerMessage,
            updateCheckout,
            updateConsignment,
            navigateNextStep,
            onUnhandledError,
            consignments,
            shipDate,
            cart,
            isMultiShippingMode
        } = this.props;

        const { giftMessages } = this.state;

        interface ConsignmentUpdateRequestBody {
            id: string;
            shippingAddress?: AddressRequestBody;
            lineItems?: Array<any>;
        }

        const promises: Array<Promise<CheckoutSelectors>> = [];

        // CHECKOUT CUSTOM FIELDS
        // Update Ship Date, Arrival Date, Gift Message, Gift Order custom fields when shipping step is completed.
        
        const updateConsignmentCustomFields = async (consignment: Consignment) => {

            if (giftMessages.length > 0) {
                var giftMessage
                giftMessage = giftMessages.find(item => item.consignmentId === consignment.id).giftMessage
            }
            const shipDateValue = shipDate.toLocaleDateString('en-US')
            const cartID = cart.id.toString()

            // Development Custom Fields
            // var customFields = [
            //     { fieldId: "field_30", fieldValue: shipDateValue },
            //     { fieldId: "field_36", fieldValue: cartID },
            //     { fieldId: "field_32", fieldValue: giftMessage && giftMessage || '' }
            // ]

            // Production Custom Fields
            var customFields = [
                { fieldId: "field_43", fieldValue: shipDateValue },
                { fieldId: "field_49", fieldValue: cartID },
                { fieldId: "field_45", fieldValue: giftMessage && giftMessage || '' }
            ]

            consignment.shippingAddress.customFields = customFields
            var consignmentLineItems: { itemId: string | number; quantity: number; }[] = []
            const lineItems = findLineItems(cart, consignment)
            lineItems.map(lineItem => consignmentLineItems.push({ itemId: lineItem.id, quantity: lineItem.quantity}))

            const payload: ConsignmentUpdateRequestBody = {
                id: consignment.id,
                shippingAddress: consignment.shippingAddress,
                lineItems: consignmentLineItems
            };

            await promises.push(updateConsignment(payload || {}))
        }

        if (isMultiShippingMode || consignments.length > 1) {
            consignments.map((consignment) => {
                updateConsignmentCustomFields(consignment)
            })
        }

        try {
            await Promise.all(promises);

            if (customerMessage !== orderComment) {
                await updateCheckout({ customerMessage: orderComment });
            }

            navigateNextStep(false);
        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(error);
            }
        }
    };
}

const deleteConsignmentsSelector = createSelector(
    ({ checkoutService: { deleteConsignment } }: CheckoutContextProps) => deleteConsignment,
    ({ checkoutState: { data } }: CheckoutContextProps) => data.getConsignments(),
    (deleteConsignment, consignments) => async () => {
        if (!consignments || !consignments.length) {
            return;
        }

        const [{ data }] = await Promise.all(consignments.map(({ id }) => deleteConsignment(id)));

        return data.getShippingAddress();
    },
);

// tslint:disable-next-line:cyclomatic-complexity
export function mapToShippingProps({
    checkoutService,
    checkoutState,
}: CheckoutContextProps): WithCheckoutShippingProps | null {
    const {
        data: {
            getCart,
            getCheckout,
            getConfig,
            getCustomer,
            getConsignments,
            getShippingAddress,
            getBillingAddress,
            getShippingAddressFields,
            getShippingCountries,
        },
        statuses: {
            isShippingStepPending,
            isSelectingShippingOption,
            isLoadingShippingOptions,
            isUpdatingConsignment,
            isCreatingConsignments,
            isCreatingCustomerAddress,
            isLoadingShippingCountries,
            isUpdatingBillingAddress,
            isUpdatingCheckout,
        },
    } = checkoutState;

    const checkout = getCheckout();
    const config = getConfig();
    const consignments = getConsignments() || [];
    const customer = getCustomer();
    const cart = getCart();

    if (!checkout || !config || !customer || !cart) {
        return null;
    }

    const {
        checkoutSettings: {
            enableOrderComments,
            features,
            hasMultiShippingEnabled,
            googleMapsApiKey,
        },
    } = config;

    const methodId = getShippingMethodId(checkout);
    const shippableItemsCount = getShippableItemsCount(cart);
    const isLoading =
        isLoadingShippingOptions() ||
        isSelectingShippingOption() ||
        isUpdatingConsignment() ||
        isCreatingConsignments() ||
        isUpdatingBillingAddress() ||
        isUpdatingCheckout() ||
        isCreatingCustomerAddress();
    const shouldShowMultiShipping =
        hasMultiShippingEnabled && !methodId && shippableItemsCount > 1 && shippableItemsCount < 50;
    const countriesWithAutocomplete = ['US', 'CA', 'AU', 'NZ'];

    if (features['CHECKOUT-4183.checkout_google_address_autocomplete_uk']) {
        countriesWithAutocomplete.push('GB');
    }

    const shippingAddress =
        !shouldShowMultiShipping && consignments.length > 1 ? undefined : getShippingAddress();

    return {
        assignItem: checkoutService.assignItemsToAddress,
        billingAddress: getBillingAddress(),
        cart,
        consignments,
        countries: getShippingCountries() || EMPTY_ARRAY,
        countriesWithAutocomplete,
        customer,
        customerMessage: checkout.customerMessage,
        createCustomerAddress: checkoutService.createCustomerAddress,
        deinitializeShippingMethod: checkoutService.deinitializeShipping,
        deleteConsignments: deleteConsignmentsSelector({ checkoutService, checkoutState }),
        getFields: getShippingAddressFields,
        googleMapsApiKey,
        initializeShippingMethod: checkoutService.initializeShipping,
        isGuest: customer.isGuest,
        isInitializing: isLoadingShippingCountries() || isLoadingShippingOptions(),
        isLoading,
        isShippingStepPending: isShippingStepPending(),
        loadShippingAddressFields: checkoutService.loadShippingAddressFields,
        loadShippingOptions: checkoutService.loadShippingOptions,
        methodId,
        providerWithCustomCheckout: config.checkoutSettings.providerWithCustomCheckout || undefined,
        shippingAddress,
        shouldShowMultiShipping,
        shouldShowAddAddressInCheckout:
            features['CHECKOUT-4726.add_address_in_multishipping_checkout'],
        shouldShowOrderComments: enableOrderComments,
        signOut: checkoutService.signOutCustomer,
        unassignItem: checkoutService.unassignItemsToAddress,
        updateBillingAddress: checkoutService.updateBillingAddress,
        updateCheckout: checkoutService.updateCheckout,
        updateShippingAddress: checkoutService.updateShippingAddress,
        updateConsignment: checkoutService.updateConsignment,
        // isStripeLinkEnabled: stripeUpeLinkEnabled,
        loadPaymentMethods: checkoutService.loadPaymentMethods,
        isFloatingLabelEnabled: isFloatingLabelEnabled(config.checkoutSettings),
    };
}

export default withCheckout(mapToShippingProps)(Shipping);
