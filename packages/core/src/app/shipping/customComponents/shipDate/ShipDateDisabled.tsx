import React from "react";
import { Fieldset, Legend } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'

const ShipDateDisabled = () => {
    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Ship Date</Legend>
                <ShippingCalendar>
                        <DatePicker 
                            calendarClassName="ship-date-calendar"
                            onChange={() => alert('Please enter a shipping address in order to select a ship date.')}
                            filterDate={() => false}
                            minDate={new Date()}
                            maxDate={new Date()}
                            inline />
                </ShippingCalendar>
        </Fieldset>
    )
}

export default ShipDateDisabled