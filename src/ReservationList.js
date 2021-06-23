import React from "react";

/**
 * 
 * @param {[{}]} reservations which is a filtered list of reservations
 * for the current input filter settings. A single reservation object looks
 * like:
 * {
      "id":"efb506f2-f24b-4143-ac51-cd7607a9a6e8",
      "start":"2020-08-31T12:30:00.000Z",
      "end":"2020-08-31T13:30:00.000Z",
      "room":{
         "id":"70866847-3a55-407e-9973-841ac4c16a29",
         "name":"Room B",
         "imageUrl":"https://staging.cove.is/parse/files/hRKEvW2lN74k5nCg6p2XtmiWRNHycE2pHpXpELMX/d0d19da4aa88734291279f5fe7a836e7_Wakefield%20Room.jpg"
      }
   },
 *
 * @returns The reservation component which displays reservation card
 */
const ReservationList = ({ reservations }) => {
  const convertToLocal = (startDateTime, endDateTime) => {
    const sdate = new Date(startDateTime);
    const edate = new Date(endDateTime);

    var formatter = new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    });

    let year;
    let month;
    let day;
    let shours;
    let sminutes;

    let ehours;
    let eminutes;
    let sdayPeriod;
    let edayPeriod;

    formatter.formatToParts(sdate).map((part) => {
      switch (part.type) {
        case "year":
          year = part.value;
          break;
        case "month":
          month = part.value;
          break;
        case "day":
          day = part.value;
          break;
        case "hour":
          shours = part.value;
          break;
        case "minute":
          sminutes = part.value;
          break;
        case "dayPeriod":
          sdayPeriod = part.value;
          break;
        default:
          break;
      }
    });

    formatter.formatToParts(edate).map((part) => {
      switch (part.type) {
        case "hour":
          ehours = part.value;
          break;
        case "minute":
          eminutes = part.value;
          break;
        case "dayPeriod":
          edayPeriod = part.value;
          break;
        default:
          break;
      }
    });

    return (
      <>
        <div>
          <b>
            {shours}:{sminutes} {sdayPeriod} - {ehours}:{eminutes} {edayPeriod}
          </b>
        </div>
        <div className="text-sm">
          {month} {day} {year}
        </div>
      </>
    );
  };

  return (
    <>
      {reservations.map((reservation) => {
        return (
          <div
            key={reservation.id}
            className="mx-auto flex flex-col xs:flex-row gap-x-4 gap-y-4 p-4 md:p-8 lg:p-11 border-gray-300 shadow-md"
          >
            <img
              className="max-h-36 rounded"
              src={reservation.room.imageUrl}
              alt={reservation.room.name}
            />
            <div className="flex flex-column">
              <time dateTime={reservation.start}>
                {convertToLocal(reservation.start, reservation.end)}
              </time>
            </div>
            <div className="sm:ml-auto text-sm">{reservation.room.name}</div>
          </div>
        );
      })}
    </>
  );
};

export default ReservationList;
