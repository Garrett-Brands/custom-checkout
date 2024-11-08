/* eslint-disable */

import { ExtensionRegion, ShippingOption } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, memo, useCallback, useEffect, useState } from 'react';

import { Extension } from '@bigcommerce/checkout/checkout-extension';

import { EMPTY_ARRAY } from '../../common/utility';
import { Checklist, ChecklistItem } from '../../ui/form';
import { LoadingOverlay } from '../../ui/loading';

import StaticShippingOption from './StaticShippingOption';

interface ShippingOptionListItemProps {
    consignmentId: string;
    isMultiShippingMode: boolean;
    selectedShippingOptionId?: string;
    shippingOption: ShippingOption;
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

const ShippingOptionListItem: FunctionComponent<ShippingOptionListItemProps> = ({
    consignmentId,
    isMultiShippingMode,
    selectedShippingOptionId,
    shippingOption,
}) => {
    const isSelected = selectedShippingOptionId === shippingOption.id;
    const [formattedShipDate, setFormattedShipDate] = useState<string | null>(null);
    const [formattedDeliveryEstimate, setFormattedDeliveryEstimate] = useState<string | null>(null);
    const [zipCode, setZipCode] = useState<string | null>(null);
    const [savedZipCode, setSavedZipCode] = useState<string | null>(null);

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

    // Effect to initialize zip code and listen for changes
    useEffect(() => {
        // jQuery selector for the zip code input
        const zipCodeInput = $('#postCodeInput')
        const zipCodeInputValue = zipCodeInput.val() as string;
        const zipCodeSpanValue = $('.postal-code').first().text().replace(/\s+/g, '').replace(/\/$/, '');

        // Function to update the zip code state
        const updateZipCode = () => {
            setZipCode(zipCodeInputValue || zipCodeSpanValue);
            const zipCodeInputEvent = new CustomEvent('zipCodeInputEvent', {
                detail: { zipCodeInput: zipCodeInputValue || zipCodeSpanValue } // Add custom data here
            });
            window.dispatchEvent(zipCodeInputEvent);
        };

        // Get the initial zip code when the component mounts
        updateZipCode();

        // Attach event listener for real-time updates
        zipCodeInput.on('input', updateZipCode);

        // Cleanup event listener on component unmount
        return () => {
            zipCodeInput.off('input');
        };
    });

    useEffect(() => {
        const shipDateObject = localStorage.getItem('selectedShipDateObject');
        const zipCodeItem = localStorage.getItem('zipCode');
        const allScheduledShipMethods: AllScheduledShipMethods | null = JSON.parse(
            localStorage.getItem('allScheduledShipMethods') || 'null'
        );
        if (shipDateObject && shipDateObject !== 'null') {
            const parsedShipDateObject: ShipDateObject = JSON.parse(shipDateObject);
            const shippingMethod = getFormattedShippingMethod(shippingOption.description)
            const deliveryDate = getDeliveryDateFormatted(allScheduledShipMethods, shippingMethod, parsedShipDateObject.isoDate)
            setFormattedShipDate(parsedShipDateObject.formatted);
            setFormattedDeliveryEstimate(deliveryDate);
        }
        if (zipCodeItem && zipCodeItem !== 'null') {
            const rawZipCode = localStorage.getItem("zipCode");
            const zipCodeItem = rawZipCode ? JSON.parse(rawZipCode) : null;
            setSavedZipCode(zipCodeItem);
        }
    }), [];

    useEffect(() => {
        if (zipCode) {
            localStorage.setItem('checkoutZipCode', JSON.stringify(zipCode))
        }
        let isMultiShip = {
            value: isMultiShippingMode
        }
        localStorage.setItem('isMultiShippingMode', JSON.stringify(isMultiShip))
        if (isSelected) {
            const shippingMethod = getFormattedShippingMethod(shippingOption.description)
            localStorage.setItem('checkoutShippingMethod', JSON.stringify(shippingMethod))
        }
    }, [zipCode, isSelected, isMultiShippingMode])

    // Function to render the estimated delivery message
    const renderEstimatedDelivery = () => {
        if (!isMultiShippingMode && formattedDeliveryEstimate && zipCode === savedZipCode) {
            return (
                <div className='shippingOptions-item-container' data-type='delivery-date'>
                    <span>Est. Delivery: {formattedDeliveryEstimate}</span>
                </div>
            );
        }
        if (isMultiShippingMode && formattedDeliveryEstimate && zipCode !== savedZipCode) {
            return;
            // return (
            //     <div className='shippingOptions-item-container' data-type='delivery-date'>
            //         <span>Est. Delivery: Update zip code to {savedZipCode} or in your cart.</span>
            //     </div>
            // )
        }
        return null;
    };

    const renderLabel = () => (
        <div className="shippingOptionLabel">
            <StaticShippingOption displayAdditionalInformation={true} method={shippingOption} />
            {isSelected && !isMultiShippingMode && (
                <Extension region={ExtensionRegion.ShippingSelectedShippingMethod} />
            )}
            {formattedShipDate && (
                <div className='shippingOptions-item-container' data-type='ship-date'>
                    <span>Ship Date: {formattedShipDate}</span>
                </div>
            )}
            {renderEstimatedDelivery()}
        </div>
    );

    return (
        <ChecklistItem
            htmlId={`shippingOptionRadio-${consignmentId}-${shippingOption.id}`}
            label={renderLabel}
            value={shippingOption.id}
        />
    );
};

export interface ShippingOptionListProps {
    consignmentId: string;
    inputName: string;
    isLoading: boolean;
    isMultiShippingMode: boolean;
    selectedShippingOptionId?: string;
    shippingOptions?: ShippingOption[];
    onSelectedOption(consignmentId: string, shippingOptionId: string): void;
}

const ShippingOptionsList: FunctionComponent<ShippingOptionListProps> = ({
    consignmentId,
    inputName,
    isLoading,
    isMultiShippingMode,
    shippingOptions = EMPTY_ARRAY,
    selectedShippingOptionId,
    onSelectedOption,
}) => {
    const handleSelect = useCallback(
        (value: string) => {
            onSelectedOption(consignmentId, value);
        },
        [consignmentId, onSelectedOption],
    );

    if (!shippingOptions.length) {
        return null;
    }

    return (
        <LoadingOverlay isLoading={isLoading}>
            <Checklist
                aria-live="polite"
                defaultSelectedItemId={selectedShippingOptionId}
                name={inputName}
                onSelect={handleSelect}
            >
                {shippingOptions.map((shippingOption) => (
                    <ShippingOptionListItem
                        consignmentId={consignmentId}
                        isMultiShippingMode={isMultiShippingMode}
                        key={shippingOption.id}
                        selectedShippingOptionId={selectedShippingOptionId}
                        shippingOption={shippingOption}
                    />
                ))}
            </Checklist>
        </LoadingOverlay>
    );
};

export default memo(ShippingOptionsList);
