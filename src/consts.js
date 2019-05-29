export const TIME_SLOTS = [
  { start: timeSlot(8, 0), end: timeSlot(9, 30) },
  { start: timeSlot(9, 35), end: timeSlot(11, 5) },
  { start: timeSlot(11, 15), end: timeSlot(12, 45) },
  { start: timeSlot(12, 50), end: timeSlot(14, 20) },
  { start: timeSlot(14, 40), end: timeSlot(16, 10) },
  { start: timeSlot(16, 15), end: timeSlot(17, 45) },
  { start: timeSlot(17, 50), end: timeSlot(19, 20) }
]

function timeSlot (hours, minutes) {
  let slot = new Date()
  slot.setHours(hours)
  slot.setMinutes(minutes)
  slot.setSeconds(0)
  slot.setMilliseconds(0)

  return slot
}
