import {
    LineItemMap,
    ShopperCurrency as ShopperCurrencyType,
    StoreCurrency,
} from '@bigcommerce/checkout-sdk';
import React, { cloneElement, FunctionComponent, isValidElement, ReactNode, useEffect, useState, useRef } from 'react';

import { preventDefault } from '@bigcommerce/checkout/dom-utils';
import { TranslatedString } from '@bigcommerce/checkout/locale';
import { Button, IconCloseWithBorder } from '@bigcommerce/checkout/ui';

import { ShopperCurrency } from '../currency';
import { Modal, ModalHeader } from '../ui/modal';
import { isSmallScreen } from '../ui/responsive';

import OrderModalSummarySubheader from './OrderModalSummarySubheader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummaryPrice from './OrderSummaryPrice';
import OrderSummarySection from './OrderSummarySection';
import OrderSummarySubtotals, { OrderSummarySubtotalsProps } from './OrderSummarySubtotals';
import OrderSummaryTotal from './OrderSummaryTotal';

export interface OrderSummaryDrawerProps {
    additionalLineItems?: ReactNode;
    items: LineItemMap;
    total: number;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrencyType;
    isOpen: boolean;
    headerLink?: ReactNode & React.HTMLProps<HTMLDivElement>;
    onRequestClose?(): void;
    onAfterOpen?(): void;
}

const OrderSummaryModal: FunctionComponent<
    OrderSummaryDrawerProps & OrderSummarySubtotalsProps
> = ({
    additionalLineItems,
    children,
    isTaxIncluded,
    taxes,
    onRequestClose,
    onAfterOpen,
    storeCurrency,
    shopperCurrency,
    isOpen,
    headerLink,
    items,
    total,
    ...orderSummarySubtotalsProps
}) => {

    interface ShipDateObject {
        formatted: string;
    }

    interface ShipDateObject {
        formatted: string;
        isoDate: string;
    }
    
    interface DeliveryDate {
        formatted: string;
    }
    
    interface ScheduledShipMethod {
        shipDate: string;
        deliveryDate: DeliveryDate;
    }
    
    interface AllScheduledShipMethods {
        [method: string]: ScheduledShipMethod[];
    }

    interface isMultiShippingMode {
        value: string;
    }

    const displayInclusiveTax = isTaxIncluded && taxes && taxes.length > 0;
    const [formattedShipDate, setFormattedShipDate] = useState<string | null>(null);
    const [formattedDeliveryEstimate, setFormattedDeliveryEstimate] = useState<string | null>(null);
    const [zipCode, setZipCode] = useState<string | null>(null);
    const [checkoutZipCode, setCheckoutZipCode] = useState<string | null>(null);
    const [addressZipCode, setAddressZipCode] = useState<string | null>(null);
    const [shippingMethod, setShippingMethod] = useState<string | null>(null);
    const [isMultiShippingMode, setIsMultiShippingMode] = useState<boolean>(false);
    const [multiShipClick, setMultiShipClick] = useState<boolean>(false);
    const [addressClick, setAddressClick] = useState<boolean>(false);
    console.log(multiShipClick)

    const subHeaderText = <OrderModalSummarySubheader
        amountWithCurrency={<ShopperCurrency amount={total} />}
        items={items}
        shopperCurrencyCode={shopperCurrency.code}
        storeCurrencyCode={storeCurrency.code}
    />;

    const continueButton = isSmallScreen() && <Button
        className='cart-modal-continue'
        data-test="manage-instrument-cancel-button"
        onClick={preventDefault(onRequestClose)}>
            <TranslatedString id="cart.return_to_checkout" />
    </Button>;

    function getDeliveryDateFormatted(
        allScheduledShipMethods: AllScheduledShipMethods | null,
        shippingMethod: string | null,
        isoDate: string | null
    ): string | null {
        if (
            allScheduledShipMethods &&
            shippingMethod &&
            Array.isArray(allScheduledShipMethods[shippingMethod])
        ) {
            const shippingData = allScheduledShipMethods[shippingMethod].find(
                (entry) => entry.shipDate === isoDate
            );
            if (shippingData) {
                return shippingData.deliveryDate.formatted;
            }
        }
        return null;
    }

    function getFormattedShippingMethod(method: string): string | null {
        const validMethods = ["Ground", "Next Day Air", "2nd Day Air"];
        for (const validMethod of validMethods) {
            if (method.includes(validMethod)) {
                return validMethod; // Return the matched method
            }
        }
        return null; // Return null if no valid method is found
    }

    const lastZipCodeRef = useRef<string | null>(null);

    useEffect(() => {
        window.addEventListener('multiShipClick', (event) => {
            const multiShipClickEvent = event as CustomEvent<{ isMultiShippingMode: boolean }>;
            console.log(multiShipClickEvent)
            setMultiShipClick(!multiShipClick)
        });
        window.addEventListener('addressClick', (event) => {
            const addressClickEvent = event as CustomEvent<{ address: Address }>;
            const eventZipCode = (addressClickEvent.detail.address as unknown as { postalCode: string }).postalCode;
            setAddressClick(!addressClick)
            setAddressZipCode(eventZipCode)
            setCheckoutZipCode(eventZipCode)
        });
        window.addEventListener('zipCodeInputEvent', (event) => {
            const zipCodeInputEvent = event as CustomEvent<{ zipCodeInput: string }>;
            const zipCodeValue = zipCodeInputEvent.detail.zipCodeInput
            if (zipCodeValue && zipCodeValue !== lastZipCodeRef.current) {
                lastZipCodeRef.current = zipCodeValue;
                setAddressZipCode(zipCodeValue);
                setCheckoutZipCode(zipCodeValue);
            }
        });
    })

    useEffect(() => {
        const shipDateObject = localStorage.getItem('selectedShipDateObject');
        const zipCodeItem = localStorage.getItem('zipCode');
        const checkoutZipCodeItem = localStorage.getItem('checkoutZipCode')
        const checkoutShippingMethod = localStorage.getItem('checkoutShippingMethod')
        const isMultiShippingModeItem = localStorage.getItem('isMultiShippingMode')
        const allScheduledShipMethods: AllScheduledShipMethods | null = JSON.parse(
            localStorage.getItem('allScheduledShipMethods') || 'null'
        );
        
        if (shipDateObject && shipDateObject !== 'null') {
            const parsedShipDateObject: ShipDateObject = JSON.parse(shipDateObject);
            const deliveryDate = getDeliveryDateFormatted(allScheduledShipMethods, shippingMethod, parsedShipDateObject.isoDate)
            setFormattedShipDate(parsedShipDateObject.formatted);
            setFormattedDeliveryEstimate(deliveryDate);
        }
        if (zipCodeItem && zipCodeItem !== 'null' && checkoutZipCodeItem && checkoutZipCodeItem !== 'null' && checkoutZipCodeItem !== undefined) {
            const rawZipCode = localStorage.getItem("zipCode");
            const zipCodeItem = rawZipCode ? JSON.parse(rawZipCode) : null;
            // const rawCheckoutZipCode = localStorage.getItem("checkoutZipCode");
            // const checkoutZipCodeItem = rawCheckoutZipCode ? JSON.parse(rawCheckoutZipCode) : null;
            setZipCode(zipCodeItem);
            // setCheckoutZipCode(checkoutZipCodeItem)
        }
        if (checkoutShippingMethod && checkoutShippingMethod !== 'null') {
            const rawShippingMethod = localStorage.getItem("checkoutShippingMethod");
            const rawShippingMethodItem = rawShippingMethod ? JSON.parse(rawShippingMethod) : null;
            setShippingMethod(getFormattedShippingMethod(rawShippingMethodItem));
        }
        if (isMultiShippingModeItem !== null && isMultiShippingModeItem !== 'null') {
            const parsedIsMultiShipModeObject: isMultiShippingMode = JSON.parse(isMultiShippingModeItem);
            if (typeof parsedIsMultiShipModeObject.value === "boolean") {
                setIsMultiShippingMode(parsedIsMultiShipModeObject.value);
            }
        }
    }), [isMultiShippingMode, zipCode, checkoutZipCode, shippingMethod, formattedShipDate, formattedDeliveryEstimate];

    const renderEstimatedDelivery = () => {
        if (zipCode === checkoutZipCode || zipCode === addressZipCode) {
            return (
                <div className="shipping-preview-item" data-type="delivery-date">
                    <span>Estimated Delivery</span>
                <span>{formattedDeliveryEstimate}</span>
            </div>
            );
        }
        return;
    }

    return <Modal
        additionalBodyClassName="cart-modal-body optimizedCheckout-orderSummary"
        additionalHeaderClassName="cart-modal-header optimizedCheckout-orderSummary with-continue-button"
        additionalModalClassName="optimizedCheckout-cart-modal"
        footer={continueButton}
        header={renderHeader({
            headerLink,
            subHeaderText,
            onRequestClose,
        })}
        isOpen={isOpen}
        onAfterOpen={onAfterOpen}
        onRequestClose={onRequestClose}
    >
        <OrderSummarySection>
            <OrderSummaryItems displayLineItemsCount={false} items={items} />
        </OrderSummarySection>
        {formattedShipDate && 
                <OrderSummarySection>
                    <div className="shipping-preview-container-orderSummary">
                        <div className="shipping-preview-item" data-type="ship-date">
                            <span>Ship Date</span>
                            <span>{formattedShipDate}</span>
                        </div>
                        { isMultiShippingMode === false && renderEstimatedDelivery()}
                        {/* <span>values: {zipCode} {checkoutZipCode} {addressZipCode}</span> */}
                    </div>
                </OrderSummarySection>
        }
        <OrderSummarySection>
            <OrderSummarySubtotals isTaxIncluded={isTaxIncluded} taxes={taxes} {...orderSummarySubtotalsProps} />
            {additionalLineItems}
        </OrderSummarySection>
        <OrderSummarySection>
            <OrderSummaryTotal
                orderAmount={total}
                shopperCurrencyCode={shopperCurrency.code}
                storeCurrencyCode={storeCurrency.code}
            />
        </OrderSummarySection>
        {displayInclusiveTax && <OrderSummarySection>
                <h5
                    className="cart-taxItem cart-taxItem--subtotal optimizedCheckout-contentPrimary"
                    data-test="tax-text"
                >
                    <TranslatedString
                        id="tax.inclusive_label"
                    />
                </h5>
                {(taxes || []).map((tax, index) => (
                    <OrderSummaryPrice
                        amount={tax.amount}
                        key={index}
                        label={tax.name}
                        testId="cart-taxes"
                    />
                ))}
            </OrderSummarySection>}
    </Modal>
};

const renderHeader: FunctionComponent<{
    headerLink?: ReactNode & React.HTMLProps<HTMLDivElement>;
    subHeaderText: ReactNode;
    onRequestClose?(): void;
}> = ({ onRequestClose, headerLink, subHeaderText }) => {
    let newHeaderLink;

    if (isValidElement(headerLink)) {
        newHeaderLink = cloneElement(headerLink, { className: 'modal-header-link cart-modal-link test' });
    }

    return <>
        {newHeaderLink ?? headerLink}
        <ModalHeader additionalClassName="cart-modal-title">
            <div>
                <TranslatedString id="cart.cart_heading" />
                <div className='cart-heading-subheader'>{subHeaderText}</div>
            </div>
        </ModalHeader>
        <a className="cart-modal-close" href="#" onClick={preventDefault(onRequestClose)}>
            <span className="is-srOnly">
                <TranslatedString id="common.close_action" />
            </span>
            <IconCloseWithBorder />
        </a>
    </>
};

export default OrderSummaryModal;
