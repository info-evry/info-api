const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const port = 4000;

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => 'Salut' };

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => console.log(`Server listening at http://localhost:${port}/graphql`));