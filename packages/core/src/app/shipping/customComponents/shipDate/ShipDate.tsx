import React, { useEffect, useState } from "react";
import { Legend, Fieldset } from "../../../ui/form";
import ShippingCalendar from "./ShippingCalendar";
import DatePicker from 'react-datepicker'
import ShippingInfo from "./ShippingInfo";
import SelectedShipDate from "./SelectedShipDate";
import ArrivalDate from "./ArrivalDate";
import ShippingBanner from "./ShippingBanner";

const ShipDate = (props: any) => {
    
    const { 
        shipDate, 
        setShipDate, 
        arrivalDate, 
        setArrivalDate 
    } = props

    const today = new Date()
    const todayReset = today.setHours(0,0,0,0)
    const bannerMessage = 'Schedule shipping up to 25 days in advance on select items.'
    
    const [address, setAddress] = useState(Object)
    const [selectedShippingOption, setSelectedShippingOption] = useState(Object)
    const [availableDates, setAvailableDates] = useState(new Array)
    const [blackoutDates, setBlackoutDates] = useState(new Array)
    const [nextAvailableDate, setNextAvailableDate] = useState(today)

    useEffect(() => {
        fetchBlackoutDates()
    }, [])

    useEffect(() => {
        setAvailableDates(getAvailableDates(today, maxDate()))
    }, [blackoutDates])

    useEffect(() => {
        if (availableDates.length > 0) {
            setNextAvailableDate(availableDates[0])
        }
    }, [availableDates])
    
    useEffect(() => {
        const currentShipDate = shipDate
        currentShipDate.getYear() !== 69 && filterDates(currentShipDate)
        ? setShipDate(currentShipDate)
        : setShipDate(nextAvailableDate)
    }, [nextAvailableDate])

    useEffect(() => {
        if (props.consignments[0]) {
            const { address, selectedShippingOption } = props.consignments[0]
            setAddress(address)
            setSelectedShippingOption(selectedShippingOption)
        }
    }, [props])

    useEffect(() => {
        if (Object.keys(address).length > 0 && selectedShippingOption) {
            fetchUPSEstimate()
        }
    }, [shipDate, address, selectedShippingOption])

    const getAvailableDates = (start: Date, end: Date) => {
        var dates = new Array
        var date = new Date(start);
        while (date <= end) {
            if (filterDates(date)) {
                dates.push(new Date(date))
            }
            date.setDate(date.getDate() + 1)
        }
        return dates
    }

    const filterDates = (date: Date) => {
        return !isToday(date) && isWeekday(date) && !isBlackoutDate(date)
    }

    const isToday = (date: Date) => {
        return date.getTime() === today.getTime()
    }

    const isWeekday = (date: Date) => {
        const day = date.getDay()
        return day !== 0 && day !== 6;
    }

    const isBlackoutDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const formattedDate = [year, month, day].join('-')
        return blackoutDates.includes(formattedDate)
    }

    const maxDate = () => {
        const maxDate = new Date(todayReset)
        maxDate.setDate(maxDate.getDate() + 25)
        return maxDate
    }

    const fetchUPSEstimate = () => {

        const year = shipDate.getFullYear()
        const month = String(shipDate.getMonth() + 1).padStart(2, '0')
        const date = String(shipDate.getDate()).padStart(2, '0')
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

        fetch(`https://api.gbdev.cloud/v1/shipping/expected-date`, reqObj)
        .then(resp => resp.json())
        .then(estimate => {
            const estimatedArrival = new Date(estimate.data.EstimatedArrival.Date.replaceAll('-', '/'))
            setArrivalDate(estimatedArrival)
        })
        .catch(error => {
            console.log('UPS ESTIMATED ARRIVAL ERROR =>', error)
        })

    }

    const fetchBlackoutDates = async () => {

        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const date = String(today.getDate()).padStart(2, '0')
        const formattedDate = [date, month, year].join('-')

        const reqObj = {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "x-access-key": "XM9xCpdv7TC1ZrzZ3ZeNYKUoCK1GHbZw"
            }
          }

        fetch(`https://api.gbdev.cloud/v1/ship-dates/blackout-dates?afterDate=${formattedDate}`, reqObj)
        .then(resp => resp.json())
        .then(({results}) => {
            const dates = results.map((result: any) => result.blackoutDate.split('-'))
            const formattedDates = dates.map((date: string) => [date[2], date[1], date[0]].join('-'))
            setBlackoutDates(formattedDates)
        })
        .catch(error => {
            console.log('BLACKOUT DATES ERROR =>', error)
        })
    }

    return(
        <Fieldset id='ship-date'>
            <Legend testId="ship-date-form-heading">Ship Date</Legend>
                    <ShippingBanner 
                        bannerMessage={bannerMessage} />
                <ShippingCalendar>
                        <DatePicker 
                            calendarClassName="ship-date-calendar"
                            selected={shipDate} 
                            onChange={(date:Date) => setShipDate(date)}
                            minDate={today}
                            maxDate={maxDate()}
                            filterDate={filterDates}
                            highlightDates={[arrivalDate]}
                            inline />
                </ShippingCalendar>
                <ShippingInfo>
                    <SelectedShipDate shipDate={shipDate} />
                    <ArrivalDate arrivalDate={arrivalDate} />
                </ShippingInfo>
        </Fieldset>
    )
}

export default ShipDate