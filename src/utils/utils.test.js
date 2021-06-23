import { isScheduleConflict } from "./utils";

import reservationListMain from "../test-data/reservationList";
import conflictingReservations from "../test-data/conflictingReservations";
import touchingReservations from "../test-data/touchingReservations";

/**
 * Sample reservation list where reservation 0 and 1 conflict. Reservation 2 does not conflict with any other reservation.
 */
describe("isScheduleConflict", () => {
  it("returns [false] for an empty list", () => {
    expect(isScheduleConflict([])).toBe(false);
  });

  it("returns [false] for an list of 1 reservation", () => {
    const oneR = reservationListMain.pop();
    expect(isScheduleConflict([oneR])).toBe(false);
  });

  describe("will detect 2 reservations that conflict", () => {
    let reservationList;
    beforeEach(() => {
      reservationList = [...reservationListMain];
    });

    it("returns [true] if reservation 2 starts before reservation 1 ends", () => {
      expect(isScheduleConflict(conflictingReservations)).toBe(true);
    });

    it("returns [true] if reservation 1 starts before reservation 2 ends with reservations between them", () => {
      const conflictingReservations1 = reservationList[0];
      const conflictingReservations2 =
        reservationList[reservationList.length - 1];

      conflictingReservations1.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations1.end = "2021-02-03T15:59:00.000Z";

      conflictingReservations2.start = "2021-02-03T15:50:00.000Z";
      conflictingReservations2.end = "2021-02-03T15:55:00.000Z";
      expect(isScheduleConflict(conflictingReservations)).toBe(true);
    });

    it("returns [true] if reservation 1 starts at same time as reservation 2", () => {
      const conflictingReservations1 = conflictingReservations[0];
      const conflictingReservations2 = conflictingReservations[1];
      conflictingReservations1.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations1.end = "2021-02-03T15:59:00.000Z";

      conflictingReservations2.start = "2021-02-03T15:50:00.000Z";
      conflictingReservations2.end = "2021-02-03T15:55:00.000Z";
      conflictingReservations1.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations1.end = "2021-02-03T15:59:00.000Z";

      conflictingReservations2.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations2.end = "2021-02-03T15:55:00.000Z";
      expect(isScheduleConflict(conflictingReservations)).toBe(true);
    });

    it("returns [true] if reservation 1 starts at same time as reservation 2 with reservations between them", () => {
      const conflictingReservations1 = reservationList[0];
      const conflictingReservations2 =
        reservationList[reservationList.length - 1];

      conflictingReservations1.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations1.end = "2021-02-03T15:59:00.000Z";

      conflictingReservations2.start = "2021-02-03T15:54:00.000Z";
      conflictingReservations2.end = "2021-02-03T15:55:00.000Z";

      expect(isScheduleConflict(conflictingReservations)).toBe(true);
    });
  });

  describe("will detect 2 reservations that 'touch' eachother", () => {
    let reservationList;
    beforeEach(() => {
      reservationList = [...reservationListMain];
    });

    it("returns [false] for (reservation2.end = reservation1.start)", () => {
      expect(isScheduleConflict(touchingReservations)).toBe(false);
    });

    it("returns [false] for (reservation1.end = reservation2.start) with reservations between them", () => {
      const touchingReservations1 = reservationList[0];
      const touchingReservations2 = reservationList[reservationList.length - 1];
      touchingReservations1.start = "2021-02-03T15:50:00.000Z";
      touchingReservations1.end = "2021-02-03T15:59:00.000Z";

      touchingReservations2.start = "2021-02-03T15:58:00.000Z";
      touchingReservations2.end = "2021-02-03T16:00:00.000Z";

      expect(isScheduleConflict(touchingReservations)).toBe(false);
    });
  });
});
