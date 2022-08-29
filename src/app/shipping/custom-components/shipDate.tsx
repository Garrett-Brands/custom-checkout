import React, { useState } from "react";
import { Legend, Fieldset } from "../../ui/form";
import DatePicker from 'react-datepicker'

const ShipDate = (props: any) => {

    console.log(props)
    const [startDate, setStartDate] = useState(new Date());

    // Exclude Weekends
    const isWeekday = (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6;
    }

    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Preferred Ship Date</Legend>
                <div className="ship-date-calendar-container">
                    <DatePicker 
                        selected={startDate} 
                        onChange={(date:Date) => setStartDate(date)}
                        calendarClassName="ship-date-calendar"
                        filterDate={isWeekday}
                        inline />
                </div>
        </Fieldset>
    )
}

export default ShipDate