const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas'); 
const { authMiddleware } = require('./utils/auth')

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware 
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If the application is running in a production environment, utilize the client/build as static resources
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startApolloServer = async () => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    // Begin listening to the specified port for incoming connections
    app.listen(PORT, () => {
      // Log a message to the console indicating the API server has started and is listening on the given port
      console.log(`API server is operational and listening on port ${PORT}!`);
      // Log a message to the console providing the URL to use the GraphQL interface
      console.log(`Access GraphQL at the following URL: http://localhost:${PORT}${server.graphqlPath}`);
    })
})
};

// Invoke the asynchronous function to initiate the server
startApolloServer();

