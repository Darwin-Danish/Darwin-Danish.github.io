import { useEffect, useState } from 'react'

interface AgeCounterProps {
  birthYear: number
  birthMonth: number
  birthDay: number
}

export default function AgeCounter({
  birthYear,
  birthMonth,
  birthDay,
}: AgeCounterProps) {
  const [age, setAge] = useState<number>(0)

  useEffect(() => {
    const calculateAge = () => {
      const today = new Date()
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay) // month is 0-indexed

      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        calculatedAge--
      }

      setAge(calculatedAge)
    }

    // Calculate age immediately
    calculateAge()

    // Set up interval to check for birthday at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const msUntilMidnight = tomorrow.getTime() - now.getTime()

    const timeoutId = setTimeout(() => {
      calculateAge()
      // Then check every 24 hours
      const intervalId = setInterval(calculateAge, 24 * 60 * 60 * 1000)

      return () => clearInterval(intervalId)
    }, msUntilMidnight)

    return () => clearTimeout(timeoutId)
  }, [birthYear, birthMonth, birthDay])

  return <span>{age}</span>
}
