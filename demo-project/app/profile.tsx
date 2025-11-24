import { useEffect, useState } from 'react'

export default function Profile() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])
  
  if (!user) return <div>Loading...</div>
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
