import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

const uriLink = createHttpLink({
  uri: '/graphql',
});

// Create request middleware that appends the JWT token to every request as an `authorization` header
const authenticationLink = setContext((_, { headers }) => {
  // Retrieve the authentication token from local storage if it's there
  const token = localStorage.getItem('id_token');
  // Return the headers to the context so uriLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Configure our client to run the `authenticationLink` middleware before making the request to our GraphQL API
  link: authenticationLink.concat(uriLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route 
              path='/' 
              element={<SearchBooks />} 
            />
            <Route 
              path='/saved' 
              element={<SavedBooks />} 
            />
            <Route 
              path='*'
              element={<h1 className='display-2'>Page not found!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;

