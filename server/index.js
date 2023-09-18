const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');
const plants = require('./plantsData.json');

// GraphQL Schema
const schema = buildSchema(`
  type Plant {
    id: ID!
    name: String!
    type: String!
    color: String!
    height: Int!
    location: String!
    images: String!
  }

  type Query {
    getAllPlants: [Plant]
    getPlantsByName(name: String!): [Plant]
  }

  type Mutation {
    updatePlantDetails(id: ID!, name: String!, type: String!, color: String!, height: Int!, location: String!, images: String!): Plant
    deletePlantDetails(id: ID!): Plant
  }
`);

// Resolver functions
const root = {
  getAllPlants: () => plants,
  getPlantsByName: ({ name }) => plants.filter((plant) => plant.name.toLowerCase().includes(name.toLowerCase())),
  updatePlantDetails: ({ id, name, type, color, height, location }) => {
    const index = plants.findIndex((plant) => plant.id === parseInt(id));
    if (index === -1) throw new Error('Plant not found');

    plants[index] = { id, name, type, color, height, location };
    return plants[index];
  },
  deltePlantDetails: ({ id}) => {
    const index = plants.findIndex((plant) => plant.id === parseInt(id));
    if (index === -1) throw new Error('Plant not found');

    const deletedPlant = plants.splice(index, 1)[0];
    return deletedPlant;
  },
};

// Create the Express app
const app = express();

app.use(cors());

// Endpoint for GraphQL queries and mutations
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable the GraphiQL interface for testing in the browser
  })
);

const PORT = process.env.PORT || 4070;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/graphql`);
});
