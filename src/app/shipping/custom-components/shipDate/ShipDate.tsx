import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingInfo from "./ShippingInfo";
import SelectedShipDate from "./SelectedShipDate";
import ArrivalDate from "./ArrivalDate";

const ShipDate = () => {

    const today = new Date()
    const day = today.getDay()
    const todayReset = today.setHours(0,0,0,0)
    var isFriday = false
    var isSaturday = false

    if (day === 5) {
        isFriday = true
    }

    if (day === 6) {
        isSaturday = true
    }

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [nextAvailableDate, setNextAvailableDate] = useState(new Date())
    const [estimatedArrival, setEstimatedArrival] = useState(new Date())
    
    useEffect(() => {
        setNextAvailableDate(getNextAvailableDay(increment()))
    }, [isFriday, isSaturday])
    
    useEffect(() => {
        setSelectedDate(nextAvailableDate)
    }, [nextAvailableDate])

    useEffect(() => {
        setEstimatedArrival(() => {
            const newETA = new Date(selectedDate)
            newETA.setDate(selectedDate.getDate() + 3)
            return newETA
        })
    }, [selectedDate])

    const getNextAvailableDay = (increment: number) => {
        const availableDay = new Date(todayReset)
        availableDay.setDate(availableDay.getDate() + increment)
        return availableDay
    }

    const filterDates = (date: Date) => {
        return isWeekday(date)
    }

    const isWeekday = (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6;
    }

    const maxDate = () => {
        const maxDate = new Date(todayReset)
        maxDate.setDate(maxDate.getDate() + 25)
        return maxDate
    }

    const minDate = () => {
        return getNextAvailableDay(increment())
    }

    const increment = () => {
        return isFriday ? 3 : ( isSaturday ? 2 : 1 )
    }

    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Preferred Ship Date</Legend>
                <ShippingCalendar>
                        <DatePicker 
                            calendarClassName="ship-date-calendar"
                            selected={selectedDate} 
                            onChange={(date:Date) => setSelectedDate(date)}
                            minDate={minDate()}
                            maxDate={maxDate()}
                            filterDate={filterDates}
                            highlightDates={[estimatedArrival]}
                            inline />
                </ShippingCalendar>
                <ShippingInfo>
                    <SelectedShipDate shipDate={selectedDate} />
                    <ArrivalDate arrivalDate={estimatedArrival} />
                </ShippingInfo>
        </Fieldset>
    )
}

export default ShipDate