import {
    ExtensionRegion,
    LineItemMap,
    ShopperCurrency,
    StoreCurrency,
} from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react';

import { Extension } from '@bigcommerce/checkout/checkout-extension';
import { TranslatedString } from '@bigcommerce/checkout/locale';

import OrderSummaryHeader from './OrderSummaryHeader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummaryPrice from './OrderSummaryPrice';
import OrderSummarySection from './OrderSummarySection';
import OrderSummarySubtotals, { OrderSummarySubtotalsProps } from './OrderSummarySubtotals';
import OrderSummaryTotal from './OrderSummaryTotal';
import removeBundledItems from './removeBundledItems';

export interface OrderSummaryProps {
    lineItems: LineItemMap;
    total: number;
    headerLink: ReactNode;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrency;
    additionalLineItems?: ReactNode;
}

const OrderSummary: FunctionComponent<OrderSummaryProps & OrderSummarySubtotalsProps> = ({
    isTaxIncluded,
    taxes,
    storeCurrency,
    shopperCurrency,
    headerLink,
    additionalLineItems,
    lineItems,
    total,
    ...orderSummarySubtotalsProps
}) => {
    const nonBundledLineItems = useMemo(() => removeBundledItems(lineItems), [lineItems]);
    const displayInclusiveTax = isTaxIncluded && taxes && taxes.length > 0;

    interface ShipDateObject {
        formatted: string;
    }

    // interface DeliveryEstimateObject {
    //     formatted: string;
    // }
      
      const [formattedShipDate, setFormattedShipDate] = useState<string | null>(null);
    //   const [formattedDeliveryEstimate, setFormatedDeliveryEstimate] = useState<string | null>(null);

      useEffect(() => {
        const shipDateObject = localStorage.getItem('selectedShipDateObject');
        // const deliveryEstimateObject = localStorage.getItem('deliveryEstimateObject');
        if (shipDateObject && shipDateObject !== 'null') {
          const parsedShipDateObject: ShipDateObject = JSON.parse(shipDateObject);
          setFormattedShipDate(parsedShipDateObject.formatted);
        }
        // if (deliveryEstimateObject && deliveryEstimateObject !== 'null') {
        //     const parsedDeliveryEstimateObject: DeliveryEstimateObject = JSON.parse(deliveryEstimateObject);
        //     setFormatedDeliveryEstimate(parsedDeliveryEstimateObject.formatted);
        //   }
      }, []); // Empty dependency array ensures this only runs once when the component mounts

    return (
        <article className="cart optimizedCheckout-orderSummary" data-test="cart">
            <OrderSummaryHeader>{headerLink}</OrderSummaryHeader>

            <OrderSummarySection>
                <OrderSummaryItems displayLineItemsCount items={nonBundledLineItems} />
            </OrderSummarySection>

            {formattedShipDate && 
                <OrderSummarySection>
                    <div className="shipping-preview-container-orderSummary">
                        <div className="shipping-preview-item" data-type="ship-date">
                            <span>Ship Date</span>
                            <span>{formattedShipDate}</span>
                        </div>
                        {/* <div className="shipping-preview-item" data-type="delivery-date">
                            <span>Estimated Delivery</span>
                            <span>{formattedDeliveryEstimate}</span>
                        </div> */}
                    </div>
                </OrderSummarySection>
            }

            <Extension region={ExtensionRegion.SummaryLastItemAfter} />

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
        </article>
    );
};

export default OrderSummary;
