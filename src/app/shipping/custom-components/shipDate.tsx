import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../ui/form";
import DatePicker from 'react-datepicker'

const ShipDate = (props: any) => {

    console.log(props)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [estimatedArrival, setEstimatedArrival] = useState(new Date())

    useEffect(() => {
        setSelectedDate(nextAvailableDate())
    },[])

    useEffect(() => {
        setEstimatedArrival(() => {
            const newETA = new Date(selectedDate)
            newETA.setDate(selectedDate.getDate() + 3)
            return newETA
        })
    }, [selectedDate])

    const nextAvailableDate = () => {
        // const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const today = new Date().setHours(0,0,0,0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow
        // is friday or saturday => monday
    }

    const filterDates = (date: Date) => {
        // console.log(date)
        // return isNotToday(date) && isWeekday(date)
        return isWeekday(date)
    }

    // const isNotToday = (date: Date) => {
    //     const today = new Date().setHours(0,0,0,0)
    //     const availableDate = date.setHours(0,0,0,0)
    //     return availableDate > today
    // }

    const isWeekday = (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6;
    }

    // const isFridaySaturday = (date: Date) => {
    //     const day = date.getDay()
    //     return day > 4
    // }

    const maxDate = () => {
        const today = new Date().setHours(0,0,0,0)
        const maxDate = new Date(today)
        maxDate.setDate(maxDate.getDate() + 25)
        return maxDate
    }
    
    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Preferred Ship Date</Legend>
                <div className="ship-date-calendar-container">
                    <DatePicker 
                        calendarClassName="ship-date-calendar"
                        selected={selectedDate} 
                        onChange={(date:Date) => setSelectedDate(date)}
                        minDate={new Date(nextAvailableDate())}
                        maxDate={new Date(maxDate())}
                        filterDate={filterDates}
                        // highlightDates={[subDays(new Date(), 7), addDays(new Date(), 7)]}
                        highlightDates={[estimatedArrival]}
                        inline />
                </div>
        </Fieldset>
    )
}

export default ShipDate