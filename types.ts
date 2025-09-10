
export interface CounterSettings {
  step: number;
  maxValue: number;
  digits: number;
  sound: boolean;
  vibration: boolean;
}

export interface Counter {
  id: string;
  name: string;
  value: number;
  settings: CounterSettings;
}
