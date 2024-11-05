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

// interface DeliveryEstimateObject {
//     formatted: string;
// }

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
    const [isoShipDate, setIsoShipDate] = useState<string | null>(null);
    const [formattedDeliveryEstimate, setFormattedDeliveryEstimate] = useState<string | null>(null);

    function getDeliveryDateFormatted(
        allScheduledShipMethods: AllScheduledShipMethods | null,
        shippingMethod: string | null,
        isoDate: string | null
    ): string | null {
        if (allScheduledShipMethods && shippingMethod && allScheduledShipMethods[shippingMethod]) {
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

    useEffect(() => {
        const shipDateObject = localStorage.getItem('selectedShipDateObject');
        const deliveryEstimateObject = localStorage.getItem('deliveryEstimateObject');
        const allScheduledShipMethods: AllScheduledShipMethods | null = JSON.parse(
            localStorage.getItem('allScheduledShipMethods') || 'null'
        );
        
        if (shipDateObject && shipDateObject !== 'null') {
            const parsedShipDateObject: ShipDateObject = JSON.parse(shipDateObject);
            setFormattedShipDate(parsedShipDateObject.formatted);
            setIsoShipDate(parsedShipDateObject.isoDate)
        }
        
        if (deliveryEstimateObject && deliveryEstimateObject !== 'null') {
            // const parsedDeliveryEstimateObject: DeliveryEstimateObject = JSON.parse(deliveryEstimateObject);
            const shippingMethod = getFormattedShippingMethod(shippingOption.description)
            const deliveryDate = getDeliveryDateFormatted(allScheduledShipMethods, shippingMethod, isoShipDate)
            setFormattedDeliveryEstimate(deliveryDate);
        }
    }), [];

    const renderLabel = useCallback(
        () => (
            <div className="shippingOptionLabel">
                <StaticShippingOption displayAdditionalInformation={true} method={shippingOption} />
                {(isSelected && !isMultiShippingMode) && (
                    <Extension region={ExtensionRegion.ShippingSelectedShippingMethod} />
                )}
                {formattedShipDate && (
                    <div className='shippingOptions-item-container' data-type='ship-date'>
                        <span>Ship Date: {formattedShipDate}</span>
                    </div>
                )}
                {formattedDeliveryEstimate && (
                    <div className='shippingOptions-item-container' data-type='delivery-date'>
                        <span>Estimated Delivery: {formattedDeliveryEstimate}</span>
                    </div>
                )}
            </div>
        ),
        [isSelected, isMultiShippingMode, shippingOption, formattedShipDate, formattedDeliveryEstimate],
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
