import React from "react";
import { Fieldset, Legend } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingBanner from "./ShippingBanner";

const ShipDateDisabled = () => {
    const bannerMessage = 'Please enter a shipping address in order to select a ship date.'
    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Ship Date</Legend>
                <ShippingBanner bannerMessage={bannerMessage} />
                <ShippingCalendar disabled={true}>
                        <DatePicker 
                            calendarClassName="ship-date-calendar"
                            onChange={() => alert(bannerMessage)}
                            filterDate={() => false}
                            minDate={new Date()}
                            maxDate={new Date()}
                            inline />
                </ShippingCalendar>
        </Fieldset>
    )
}

export default ShipDateDisabled