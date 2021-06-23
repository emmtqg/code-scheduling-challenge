/**
 * @param {{ start: Date, end: Date }[]} reservations - list of reservations
 *
 * @returns true if any 2 reservations conflict
 *   - reservations conflict if their times overlap in any way
 *   - reservations DO NOT conflict if they are just touching each other (reservation1.end === reservation2.start)
 */

export const isScheduleConflict = (reservations) => {
  if (!reservations || reservations?.length === 1) {
    return false;
  }

  // eslint-disable-next-line no-undef
  const dateHash = new Map();
  let sdate;
  let stime;
  let etime;

  for (let i = 0; i < reservations.length; ++i) {
    const r = reservations[i];
    // only evaluating the date, reservations are UTC time
    [sdate, stime] = r.start.split("T");
    [, etime] = r.end.split("T");

    if (dateHash.has(sdate)) {
      let times = dateHash.get(sdate);

      // for each time in the hash for this date
      for (let ii = 0; ii < times.length; ++ii) {
        const t = times[ii];

        // check for start/end time overlap
        if (
          (t.start >= stime && t.start < etime) ||
          (stime >= t.start && stime < t.end)
        ) {
          return true;
        }
      }

      times.push(stime, etime);
    } else {
      // add this new date to the hash
      dateHash.set(sdate, [{ start: stime, end: etime }]);
    }
  }

  return false;
};
