[![npm version](https://badge.fury.io/js/gql-profiler.svg)](https://badge.fury.io/js/gql-profiler)

# GraphQL Profiler

A standalone performance profiler for GraphQL resolvers

## Getting Started

**Installation**

Add the profiler to your project dependencies.

```js
npm install --save gql-profiler
yarn add gql-profiler
```

Choose a reporter, wrap your resolvers with the profiler and use the reporter whenever you want:

```js
import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } 'apollo-server-express';
import { profileResolvers, htmlReporter } from 'gql-profiler';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

const reporter = htmlReporter();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: profileResolvers(resolvers, { reporter }),
});

const app = express();

app.get('/profiler', (req, res) => {
    res.send(reporter.getHtml());
});

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
});
```

The profiler report will be available at http://localhost:3000/profiler

## Configuration

```js
profileResolvers(resolvers, {
    reporter, // A reporter to gather your data (see the list below) - Mandatory
    enabled: true, // If false, the resolvers aren't profiled
    disableInProduction: true, // Force disable the profiler the env is production
    env: process.env.NODE_ENV,
    getResolverName: () => '', // Function to get the resolver name
});
```

### Available Reporters

**nullReporter**

```js
import { nullReporter } from 'gql-reporter';
const reporter = nullReporter();
```
Does literaly nothing and doesn't have useful API.

**memoryReporter**

```js
import { memoryReporter } from 'gql-reporter';
const reporter = memoryReporter();
const events = reporter.getEvents(); // Retrieve each resolver calls
const hierarchy = reporter.getHierarchy(); // Same, but in a dependency tree
reporter.reset(); // Delete all data in the reporter
```

**htmlReporter**

```js
import { htmlReporter } from 'gql-reporter';
const reporter = htmlReporter();
const events = reporter.getEvents(); // Retrieve each resolver calls
const hierarchy = reporter.getHierarchy(); // Same, but in a dependency tree
const html = reporter.getHtml(); // Build a nice HTML page with charts
reporter.reset(); // Delete all data in the reporter
```

**More soon?**

- websocketReporter
- chromeDevtoolsReporter
- redisReporter
- traceEventFormatReporter

### Write your own reporter
Write a reporter is very simple, here is an example for of a consoleReporter:

```js
import uuid from 'uuid';

const consoleReporter = () => ({
    // Instanciate a new event that will be passed through the other functions
    newEvent: (resolver, args, name) => {
        return { id: uuid.v4(), name };
    },
    start: (evt) => {
        console.log(`${evt.name}#${evt.id} started at`, new Date());
    },
    end: (evt, result) => {
        console.log(`${evt.name}#${evt.id} ended at`, new Date());
    },
    error: (evt, error) => {
        console.log(`${evt.name}#${evt.id} encountered an error at`, new Date());
        console.error(error);
    },
});
```

Only the `newEvent` function is mandatory.
But if you don't provide any of these function, the profiler will fail silently without crashing the resolver.

## License

Comfygure is licensed under the [MIT License](https://github.com/marmelab/comfygure/blob/master/LICENSE), sponsored and supported by [marmelab](http://marmelab.com).
