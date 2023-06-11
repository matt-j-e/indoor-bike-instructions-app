const workouts=[
  {
    description: 'VO2 - 2 sets of (4 x 1 min work interval with 2 min recovery). 5 min between sets.',
    steps: [
      // Warmup (you and your trainer)
      { duration: 420, watts: 50 },
      { duration: 180, watts: 85, cadence: '85-95' },
      { duration: 60, watts: 60 }, // calibrate trainer
      { duration: 120, watts: 105, cadence: '85-95' },
      { duration: 30, watts: 145, cadence: '90-105' },
      { duration: 60, watts: 85, cadence: '85-95' },
      { duration: 30, watts: 170, cadence: '90-105' },
      { duration: 60, watts: 85, cadence: '85-95' },
      { duration: 30, watts: 200, cadence: '90-105' },
      { duration: 270, watts: 85, cadence: '85-95' },
      // Main set 1
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      // Recovery
      { duration: 300, watts: 75, cadence: '85-95' },
      // Main set 2
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      { duration: 60, watts: 205, cadence: '90-105' },
      { duration: 120, watts: 75, cadence: '85-95' },
      // Cool down
      { duration: 150, watts: 60, cadence: '85-95' },
      { duration: 150, watts: 50, cadence: '85-95' },
    ]
  },
  {
    description:'Development test workout',
    steps:[
      {duration:15,watts:85},
      {duration:15,watts:100},
      {duration:15,watts:120},
      {duration:15,watts:140},
      {duration:120,watts:200},
      {duration:60,watts:100},
      {duration:60,watts:50}
    ]
  },
]