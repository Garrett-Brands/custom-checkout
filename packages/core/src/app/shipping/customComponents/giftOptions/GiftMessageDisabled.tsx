import React from "react";
import { Fieldset, Legend } from "../../../ui/form";
import GiftOptions from "./GiftOptions";
import AddGiftMessage from "./AddGiftMessage";

const GiftMessageDisabled = () => {
    return(
        <Fieldset id='gift-message'>
            <Legend testId="gift-message-form-heading"><span>Gift Options</span></Legend>
            <GiftOptions>
                <div className='toggle-gift-message-add-disabled'>
                    <AddGiftMessage />
                </div>
            </GiftOptions>
        </Fieldset>
    )
}

export default GiftMessageDisabled