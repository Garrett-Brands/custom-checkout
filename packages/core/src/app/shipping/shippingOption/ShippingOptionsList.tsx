import { ExtensionRegion, ShippingOption } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, memo, useCallback, useState, useEffect } from 'react';

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
}

interface DeliveryEstimateObject {
    formatted: string;
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

    useEffect(() => {
        const shipDateObject = localStorage.getItem('selectedShipDateObject');
        const deliveryEstimateObject = localStorage.getItem('deliveryEstimateObject');
        
        if (shipDateObject) {
            const parsedShipDateObject: ShipDateObject = JSON.parse(shipDateObject);
            setFormattedShipDate(parsedShipDateObject.formatted);
        }
        
        if (deliveryEstimateObject) {
            const parsedDeliveryEstimateObject: DeliveryEstimateObject = JSON.parse(deliveryEstimateObject);
            setFormattedDeliveryEstimate(parsedDeliveryEstimateObject.formatted);
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
