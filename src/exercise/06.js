// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
  fetchPokemon,
} from '../pokemon'

/* 6. 💯 use react-error-boundary */
import {ErrorBoundary} from 'react-error-boundary'

/* 4. 💯 create an ErrorBoundary component 
This is the only class component you ever have to write because currently, error boundaries are required to be class components

    class MyErrorBoundary extends React.Component {
      state = {error: null}
      static getDerivedStateFromError(error) {
        return {error}
      }
      render() {
        const {error} = this.state
        if (error) {
          return <this.props.FallbackComponent error={error} />
        }
        return this.props.children
      }
    }

*/

function PokemonInfo({pokemonName}) {
  /* 3. 💯 store the state in an object */
  // This is no longer the case in React 18 as it supports automatic batching for asynchronous callback too.
  // Still, it is better to maintain closely related states as an object rather than maintaining them using individual useState hooks.
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      })
      .catch(error => {
        setState({status: 'rejected', error: error})
      })
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // this will be handled by error boundary
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible!')
}

/* 7. 💯 reset the error boundary */
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      🚨 There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again!</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      {/* {5. 💯 re-mount the error boundary} - using key prop!!!!*/}
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        resetKeys={[pokemonName]}
        onReset={handleReset}
      >
        <div className="pokemon-info">
          <PokemonInfo pokemonName={pokemonName} />
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default App
