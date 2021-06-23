import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import "./App.css";

import DatePicker from "./DatePicker";
import DropDownSelect from "./DropDownSelect";
import ReservationList from "./ReservationList";
import useFetch from "./hooks/useFetch";

/**
 * App.js drive application:
 * * performs initial fetch of URL defined in .env file
 * REACT_APP_API_URL which loads response
 * * loads room dropdown with unique rooms pulls from the
 * response
 * * manages the callbacks for both the room and date filters
 */
const App = () => {
  const [reservationDate, setFilterDate] = useState(new Date());

  const [filteredResponse, setFilteredResponse] = useState(null);

  const [allRooms, setAllRooms] = useState([]);

  const [selectedRoom, setFilteredRoom] = useState(
    process.env.REACT_APP_ANY_ROOM_TEXT
  );

  // retrieve rooms from the endpoint (once only)
  const { data: response, isLoading, isError } = useFetch(
    `${process.env.REACT_APP_API_URL}`,
    []
  );

  /**
   * handleRoomSelect: callback from room select dropdown
   * @param {string} newRoom selected from room dropdown
   * useEffect monitors for the change on selectedRoom
   */
  const handleRoomSelect = (newRoom) => {
    setFilteredResponseByDate(reservationDate);
    setFilteredRoom(newRoom);
  };

  useEffect(() => {
    if (filteredResponse) {
      let filteredRes = filteredResponse;

      if (selectedRoom !== process.env.REACT_APP_ANY_ROOM_TEXT) {
        filteredRes = filteredResponse.filter((reservation) => {
          return reservation.room.name === selectedRoom;
        });
      }

      setFilteredResponse(filteredRes);
    }
  }, [selectedRoom]);

  /**
   * Called to filter entire reservation List response by the input
   * filters
   * @param {Date} reservationDate The user selected date on the
   * calendar input, defaults to today
   */
  const setFilteredResponseByDate = (reservationDate) => {
    const selectedDate = format(reservationDate, "yyyy-MM-dd");

    const filteredRes = response.filter((reservation) => {
      const timeZone = "EST";
      const localDate = utcToZonedTime(new Date(reservation.start), timeZone);
      const rDate = format(new Date(localDate), "yyyy-MM-dd");

      return rDate === selectedDate;
    });

    setFilteredResponse(filteredRes);
  };

  const setAvailableRooms = () => {
    // eslint-disable-next-line no-undef
    const allRoomsMap = new Map();
    allRoomsMap.set("0", process.env.REACT_APP_ANY_ROOM_TEXT);

    response.map((reservation) => {
      if (!allRoomsMap.has(reservation.room.id)) {
        allRoomsMap.set(reservation.room.id, reservation.room.name);
      }
    });

    const roomArray = [];
    for (let [key, value] of allRoomsMap) {
      roomArray.push({ key, value });
    }

    setAllRooms(roomArray);
    setFilteredRoom(selectedRoom);
  };

  /**
   * Loads the reservations once the fetch hook completes.
   * handle errors.
   */
  useEffect(() => {
    if (!isLoading && !isError && response.length) {
      setFilteredResponseByDate(reservationDate);
      setAvailableRooms(response);
    }
  }, [response, isLoading, isError, reservationDate]);

  // Get the ISO Date only and compare to see
  // if a 'Make reservation?' option should show
  const newReservationQuery =
    new Date(reservationDate).toISOString().split("T")[0] >=
    new Date().toISOString().split("T")[0];

  return (
    <div className="app">
      <div className="app-content">
        <div className="app-filters">
          <div className="app-filter-item">
            <DatePicker
              showTimeSelect
              showTimeInput
              value={reservationDate}
              onChange={(newDate) => setFilterDate(newDate)}
              selected={reservationDate}
            />
          </div>
          <div className="app-filter-item">
            {allRooms.length > 0 && (
              <DropDownSelect
                value={selectedRoom}
                onChange={(newRoom) => handleRoomSelect(newRoom)}
                options={allRooms}
              />
            )}
          </div>
        </div>
        <div className="app-reservations">
          {filteredResponse?.length > 0 ? (
            <ReservationList reservations={filteredResponse} />
          ) : (
            <>
              <h2>
                No Reservations are found for this date for {selectedRoom}.
              </h2>
              <h3>{newReservationQuery}</h3>
              {newReservationQuery && (
                <h3>Would you like to make a reservation?</h3>
              )}
            </>
          )}
        </div>
      </div>
      <footer>
        <section>EMM</section>
        <section>
          <p>
            Photo Room A by
            <a
              className="credit"
              href="https://unsplash.com/@yibeigeng?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            >
              Yibei Geng
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/s/photos/meeting-room?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </p>
          <p>
            Photo Room B by
            <a href="https://unsplash.com/@kpzhnv?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Damir Kopezhanov
            </a>{" "}
            on{" "}
            <a href="https://unsplash.com/s/photos/meeting-room?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </p>
        </section>
      </footer>
    </div>
  );
};

export default App;
