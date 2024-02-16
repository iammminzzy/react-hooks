// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import {useState, useEffect, useRef} from 'react'

/* 3. 💯 custom hook */
// To separate the logic or UI and reuse that anywhere in our application.
// Just think about how you take some pieces of code and abstract them!
// Then, we don't need to change anything in our components whenever requirements change! We can simply modify the custom hook only.
// ✨ CUSTOM HOOK CONVENTION : It should be named with a prefix of 'use' - ESLint plugin 'react-hooks/rules'

/* 4. 💯 flexible localStorage hook */
// Take your custom useLocalStorageState hook and make it generic enough to support any data type.
function useLocalStorageWithState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  /* 2. 💯 effect dependencies */
  // Even if doing actions which is not related to useEffect, useEffect is keep called every single time. It's not going to impact our performance a lot, but sometimes it might. That's why we need to add dependencies in useEffect.

  const prevKeyRef = useRef(key)

  // key = 'key2'
  useEffect(() => {
    console.log(prevKeyRef.current, key)
    const prevKey = prevKeyRef.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  /* 1. 💯 lazy state initialization */
  // When typing each character, we're getting another render which is not great for our performance. Also, reading out of localStorage is unnecessary because we already did that the first time. That's why we need to somehow lazily read into this localStorage.
  const [name, setName] = useLocalStorageWithState('name', initialName)

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
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(prev => prev + 1)}>{count}</button>
      <Greeting />
    </>
  )
}

export default App
