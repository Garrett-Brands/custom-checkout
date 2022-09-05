import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingInfo from "./ShippingInfo";
import SelectedShipDate from "./SelectedShipDate";
import ArrivalDate from "./ArrivalDate";

const ShipDate = (props: any) => {

    const { address, selectedShippingOption } = props.consignments[0]
    const { setShipDate, setArrivalDate } = props
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
        setShipDate(selectedDate)
    }, [selectedDate])

    useEffect(() => {
        setArrivalDate(estimatedArrival)
    }, [estimatedArrival])
    
    useEffect(() => {
        setNextAvailableDate(getNextAvailableDay(increment()))
    }, [isFriday, isSaturday])
    
    useEffect(() => {
        setSelectedDate(nextAvailableDate)
    }, [nextAvailableDate])

    useEffect(() => {
        if (address && selectedShippingOption) {
            fetchUPSEstimate()
        }
    }, [selectedDate, address, selectedShippingOption])

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

    const fetchUPSEstimate = () => {

        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const date = String(selectedDate.getDate()).padStart(2, '0')
        const formattedDate = [year, month, date].join('')

        var body = {
            "to": {
                "city": address.city,
                "state": address.stateOrProvince,
                "postal_code": address.postalCode,
                "country": address.country
            },
            "pickup_date": formattedDate,
            "shipping_method": selectedShippingOption.description
        }
        
        var reqObj = {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            },
            body: JSON.stringify(body)
          }

        // console.log('selectedDate', selectedDate, 'formattedDate', formattedDate)
        // console.log('selectedShippingOption', selectedShippingOption.description)

        fetch(`https://api.gbdev.cloud/v1/shipping/expected-date`, reqObj)
        .then(resp => resp.json())
        .then(estimate => {
            const estimatedArrival = new Date(estimate.data.EstimatedArrival.Date.replaceAll('-', '/'))
            // console.log('UPS ESTIMATED ARRIVAL =>', estimate.data.EstimatedArrival.Date, 'estimatedArrival =>', estimatedArrival)
            setEstimatedArrival(estimatedArrival)
        })
        .catch(error => {
            console.log('UPS ESTIMATED ARRIVAL ERROR =>', error)
        })

    }

    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Ship Date</Legend>
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