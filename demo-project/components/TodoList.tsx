import React from 'react'

export default function TodoList({ todos }) {
  var count = 0
  
  return (
    <div>
      <h2>My Todos</h2>
      {todos.map(todo => (
        <div>
          <input type="checkbox" />
          <span>{todo.text}</span>
          <button onClick={() => {
            console.log('Delete:', todo.id)
            count++
          }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
