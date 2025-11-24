'use client'
import { useState } from 'react'

export default function Dashboard() {
  const theme = window.localStorage.getItem('theme') || 'light'
  const [count, setCount] = useState(0)
  
  return (
    <div className={theme}>
      <h1>Dashboard</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
