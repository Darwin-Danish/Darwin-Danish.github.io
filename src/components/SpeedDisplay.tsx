import { useState, useEffect } from 'react'

export default function SpeedDisplay() {
  const [speed, setSpeed] = useState(245)

  useEffect(() => {
    const updateSpeed = () => {
      // Realistic F1 speed ranges: 180-330 km/h
      // More likely to be in the 200-300 range
      const baseSpeed = Math.random() * 100 + 200 // 200-300
      const variation = (Math.random() - 0.5) * 40 // ±20 variation
      const newSpeed = Math.round(baseSpeed + variation)

      // Clamp to realistic range
      const clampedSpeed = Math.max(180, Math.min(330, newSpeed))
      setSpeed(clampedSpeed)
    }

    // Update speed every 1-3 seconds randomly
    const scheduleNextUpdate = () => {
      const delay = Math.random() * 2000 + 1000 // 1-3 seconds
      setTimeout(() => {
        updateSpeed()
        scheduleNextUpdate()
      }, delay)
    }

    scheduleNextUpdate()
  }, [])

  return (
    <span className="font-mono transition-all duration-500 ease-in-out">
      {speed} km/h
    </span>
  )
}
