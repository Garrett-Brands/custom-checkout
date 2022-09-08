import React from "react";
import { CheckboxFormField } from "../../../ui/form";

const GiftOrderForm = (props: any) => {

    const { setIsGiftOrder } = props
    const labelContent = 'This order is a gift.'

    return(
        <CheckboxFormField
            id="isGiftOrder"
            labelContent={ labelContent }
            name="isGiftOrder"
            onChange={ setIsGiftOrder } />
    )
}

export default GiftOrderForm