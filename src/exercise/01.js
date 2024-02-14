// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import {useState} from 'react'

function Greeting({initialName = ''}) {
  /*
    "useState" is one of the basic hooks from react.
    "useState" : This component can re-render any time this state that I want you to manage is going to change.
    The purpose of "useState" is to declare a state variable and a function that can be used to update that variable.
  */

  /* 1. 💯 accept an initialName */
  const [name, setName] = useState(initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
