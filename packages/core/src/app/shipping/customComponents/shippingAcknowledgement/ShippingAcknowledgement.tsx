import React, { useEffect } from "react";
import { CheckboxFormField as AcknowledgementCheckbox } from "../../../ui/form";

const ShippingAcknowledgment = (props: any) => {

    const { setShippingAcknowledged, shippingAcknowledged } = props
    const labelContent = 'Chocolate is more likely to melt in warmer temperatures. By selecting ground shipping, I acknowledge Garrett is not responsible for heat damage caused during shipping. UPS 2nd Day Air and Next Day Air are preferred shipping methods to reduce the likelihood of chocolate melting.'

    useEffect(() => {
        setShippingAcknowledged(false)
    }, [])

    console.log(shippingAcknowledged)

    return (
        <div className={ shippingAcknowledged ? "shipping-acknowledgement-container--checked" : "shipping-acknowledgement-container--not-checked" }>
            <AcknowledgementCheckbox
                labelContent={labelContent}
                name={'shipping-acknowledgment'}
                onChange={setShippingAcknowledged}
            />
        </div>
    )
}

export default ShippingAcknowledgment