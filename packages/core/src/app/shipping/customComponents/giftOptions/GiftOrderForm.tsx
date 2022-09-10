import React from "react";
import { CheckboxFormField } from "../../../ui/form";

const GiftOrderForm = (props: any) => {
    const { setIsGiftOrder, additionalClassName } = props
    const labelContent = 'This order is a gift.'
    return(
        <CheckboxFormField
            id="isGiftOrder"
            additionalClassName={ additionalClassName }
            labelContent={ labelContent }
            name="isGiftOrder"
            onChange={ setIsGiftOrder } />
    )
}

export default GiftOrderForm