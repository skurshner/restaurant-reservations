import React from "react";
import ReservationListItem from "./ReservationListItem";

const ReservationList = ({ date, reservations }) => {
  const reservationHeader = () => {
    if (!reservations.length) {
      return `No Reservations for ${date}`;
    }
    if (reservations.length === 1) {
      return `1 Reservation for ${date}`;
    }
    return `${reservations.length} Reservations for ${date}`;
  };

  return (
    <div>
      <div className="d-md-flex mb-3">
        <h2>{reservationHeader()}</h2>
      </div>
      {reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          reservation_date,
          reservation_time,
          people,
        }) => {
          return (
            <div key={reservation_id}>
              <ReservationListItem
                firstName={first_name}
                lastName={last_name}
                mobile_number={mobile_number}
                reservation_date={reservation_date}
                reservation_time={reservation_time}
                people={people}
              />
            </div>
          );
        }
      )}
    </div>
  );
};

export default ReservationList;
