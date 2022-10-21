import { Address, AddressRequestBody, Cart, CheckoutRequestBody, CheckoutSelectors, Consignment, ConsignmentAssignmentRequestBody, ConsignmentUpdateRequestBody, Country, Customer, CustomerRequestOptions, FormField, ShippingInitializeOptions, ShippingRequestOptions } from '@bigcommerce/checkout-sdk';
import { noop } from 'lodash';
import React, { Component, ReactNode } from 'react';
import { createSelector } from 'reselect';

import { isEqualAddress, mapAddressFromFormValues } from '../address';
import { withCheckout, CheckoutContextProps } from '../checkout';
import { EMPTY_ARRAY } from '../common/utility';
import { LoadingOverlay } from '../ui/loading';

import { UnassignItemError } from './errors';
import findLineItems from './findLineItems';
import getShippableItemsCount from './getShippableItemsCount';
import getShippingMethodId from './getShippingMethodId';
import { MultiShippingFormValues } from './MultiShippingForm';
import ShippingForm from './ShippingForm';
import ShippingHeader from './ShippingHeader';
import { SingleShippingFormValues } from './SingleShippingForm';

export interface ShippingProps {
    isBillingSameAsShipping: boolean;
    cartHasChanged: boolean;
    isMultiShippingMode: boolean;
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

        try {
            await Promise.all([
                loadShippingAddressFields(),
                loadShippingOptions(),
            ]);

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
            ...shippingFormProps
        } = this.props;

        const {
            isInitializing,
            isGiftOrder,
            giftMessages
        } = this.state;

        const setIsGiftOrder = (isGiftOrder: boolean) => {
            this.setState({isGiftOrder: isGiftOrder})
        }

        const setGiftMessages = (giftMessages: Array<any>) => {
            debugger
            this.setState({giftMessages: giftMessages})
        }

        console.log(giftMessages)

        return (
            <div className="checkout-form">
                <ShippingHeader
                    isGuest={ isGuest }
                    isMultiShippingMode={ isMultiShippingMode }
                    onMultiShippingChange={ this.handleMultiShippingModeSwitch }
                    shouldShowMultiShipping={ shouldShowMultiShipping }
                />

                <LoadingOverlay
                    isLoading={ isInitializing }
                    unmountContentWhenLoading
                >
                    <ShippingForm
                        { ...shippingFormProps }
                        addresses={ customer.addresses }
                        deinitialize={ deinitializeShippingMethod }
                        initialize={ initializeShippingMethod }
                        isBillingSameAsShipping = { isBillingSameAsShipping }
                        isGuest={ isGuest }
                        isMultiShippingMode={ isMultiShippingMode }
                        onMultiShippingSubmit={ this.handleMultiShippingSubmit }
                        onSingleShippingSubmit={ this.handleSingleShippingSubmit }
                        onUseNewAddress={ this.handleUseNewAddress }
                        shouldShowSaveAddress={ !isGuest }
                        updateAddress={ updateShippingAddress }
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
                    
                </LoadingOverlay>
            </div>
        );
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
            addressValues.customFields.field_30 = shipDateValue
            addressValues.customFields.field_38 = arrivalDateValue
            addressValues.customFields.field_32 = giftMessageValue
            isGiftOrder ? addressValues.customFields.field_34 = ['0'] : addressValues.customFields.field_34 = []
            addressValues.customFields.field_36 = cartID
        }

        const updatedShippingAddress = addressValues && mapAddressFromFormValues(addressValues);
        const promises: Array<Promise<CheckoutSelectors>> = [];
        const hasRemoteBilling = this.hasRemoteBilling(methodId);

        if (!isEqualAddress(updatedShippingAddress, shippingAddress)) {
            promises.push(updateShippingAddress(updatedShippingAddress || {}));
        }

        if (billingSameAsShipping &&
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
            onUnhandledError(error);
        }
    };

    private hasRemoteBilling: (methodId?: string) => boolean = methodId => {
        const PAYMENT_METHOD_VALID = ['amazonpay'];

        return PAYMENT_METHOD_VALID.some(method => method === methodId);
    };

    private handleUseNewAddress: (address: Address, itemId: string) => void = async (address, itemId) => {
        const { unassignItem, onUnhandledError } = this.props;

        try {
            await unassignItem({
                address,
                lineItems: [{
                    quantity: 1,
                    itemId,
                }],
            });

            location.href = '/account.php?action=add_shipping_address&from=checkout';
        } catch (e) {
            onUnhandledError(new UnassignItemError(e));
        }
    };

    private handleMultiShippingSubmit: (values: MultiShippingFormValues) => void = async ({ orderComment }) => {
        const {
            consignments,
            customerMessage,
            updateCheckout,
            updateConsignment,
            navigateNextStep,
            onUnhandledError,
            shipDate,
            cart
            // giftMessage
        } = this.props;

        // const { isGiftOrder } = this.state;

        interface ConsignmentUpdateRequestBody {
            id: string;
            shippingAddress?: AddressRequestBody;
            lineItems?: Array<any>;
        }

        const promises: Array<Promise<CheckoutSelectors>> = [];
        
        const updateConsignmentCustomFields = async (consignment: Consignment) => {
            const shipDateValue = shipDate.toLocaleDateString('en-US')
            const cartID = cart.id.toString()
            var customFields = [
                { fieldId: "field_30", fieldValue: shipDateValue },
                { fieldId: "field_36", fieldValue: cartID }
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

        if (consignments.length > 1) {
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
            onUnhandledError(error);
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

        const [{ data }] = await Promise.all(consignments.map(({ id }) =>
            deleteConsignment(id)
        ));

        return data.getShippingAddress();
    }
);

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
    const isLoading = (
        isLoadingShippingOptions() ||
        isSelectingShippingOption() ||
        isUpdatingConsignment() ||
        isCreatingConsignments() ||
        isUpdatingBillingAddress() ||
        isUpdatingCheckout() ||
        isCreatingCustomerAddress()
    );
    const shouldShowMultiShipping = (
        hasMultiShippingEnabled &&
        !methodId &&
        shippableItemsCount > 1 &&
        shippableItemsCount < 50
    );
    const countriesWithAutocomplete = ['US', 'CA', 'AU', 'NZ'];

    if (features['CHECKOUT-4183.checkout_google_address_autocomplete_uk']) {
        countriesWithAutocomplete.push('GB');
    }

    const shippingAddress = !shouldShowMultiShipping && consignments.length > 1 ? undefined : getShippingAddress();

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
        shippingAddress,
        shouldShowMultiShipping,
        shouldShowAddAddressInCheckout: features['CHECKOUT-4726.add_address_in_multishipping_checkout'],
        shouldShowOrderComments: enableOrderComments,
        signOut: checkoutService.signOutCustomer,
        unassignItem: checkoutService.unassignItemsToAddress,
        updateBillingAddress: checkoutService.updateBillingAddress,
        updateCheckout: checkoutService.updateCheckout,
        updateShippingAddress: checkoutService.updateShippingAddress,
        updateConsignment: checkoutService.updateConsignment,
    };
}

export default withCheckout(mapToShippingProps)(Shipping);
