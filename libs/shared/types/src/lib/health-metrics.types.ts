export interface IBloodPressure {
  systolic: number // The top number in blood pressure reading
  diastolic: number // The bottom number in blood pressure reading
  pulse: number // Heart rate in beats per minute
  timestamp: Date // When the measurement was taken
  notes?: string // Optional notes about the measurement
}

export interface IUser {
  id: string
  email: string
  name: string
  telegramId?: string // Optional Telegram user ID for bot integration
  settings: IUserSettings
}

export interface IUserSettings {
  reminderEnabled: boolean
  reminderTime?: string // Time of day for reminders in HH:mm format
  measurementUnits: 'mmHg' // Currently only supporting mmHg, can be extended
  targetRanges: ITargetRanges
}

export interface ITargetRanges {
  systolic: {
    min: number
    max: number
  }
  diastolic: {
    min: number
    max: number
  }
  pulse: {
    min: number
    max: number
  }
}

export interface IMeasurementStats {
  average: IBloodPressure
  min: IBloodPressure
  max: IBloodPressure
  count: number
  period: 'day' | 'week' | 'month' | 'year'
}

// DTOs for API requests
export interface ICreateMeasurementDto {
  systolic: number
  diastolic: number
  pulse: number
  notes?: string
}

export interface IUpdateSettingsDto extends Partial<IUserSettings> {}

// Response types
export interface IMeasurementResponse {
  data: IBloodPressure
  message: string
  success: boolean
}

export interface IStatsResponse {
  data: IMeasurementStats
  message: string
  success: boolean
}