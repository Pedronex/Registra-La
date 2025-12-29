import { calculateHourBalance, calculateTotalHoursWorked } from '../balance'

describe('balance', () => {
  const mockConfig: any = {
    id: 1,
    workHours: 480, // 8 hours
    tolerance: 10,
  }

  const mockWorkRecord: any = {
    id: 1,
    type: 'trabalho',
    timeInMinutes: 480, // 08:00
    date: '2023-01-01',
    isFullDay: false,
  }

  const mockWorkRecordEnd: any = {
    ...mockWorkRecord,
    id: 2,
    timeInMinutes: 1020, // 17:00 (9 hours later)
  }

  it('should calculate total hours worked correctly', () => {
    const records = [mockWorkRecord, mockWorkRecordEnd]
    // 08:00 to 17:00 = 9 hours
    expect(calculateTotalHoursWorked(records, false, 0)).toBe('09:00:00')
  })

  it('should calculate balance correctly', () => {
    const records = [mockWorkRecord, mockWorkRecordEnd]
    // Worked 9 hours. Target 8 hours. Balance +1 hour.
    expect(calculateHourBalance(records, mockConfig, false, 0)).toBe('01:00:00')
  })

  it('should handle negative balance', () => {
    const shortDayEnd = { ...mockWorkRecordEnd, timeInMinutes: 600 } // 10:00 (2 hours worked)
    const records = [mockWorkRecord, shortDayEnd]
    // Worked 2 hours. Target 8 hours. Balance -6 hours.
    expect(calculateHourBalance(records, mockConfig, false, 0)).toBe('-06:00:00')
  })
  
  it('should handle tolerance', () => {
     // Target 8h (480min). Worked 8h 5m. Tolerance 10m. Should be 00:00.
     // 480 start. 480 + 480 + 5 = 965 end.
     // Total 485 mins. Target 480. Diff +5. Within 10.
     const records = [mockWorkRecord, { ...mockWorkRecordEnd, timeInMinutes: 480 + 480 + 5 }]
     expect(calculateHourBalance(records, mockConfig, false, 0)).toBe('00:00')
  })
})
