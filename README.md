[![npm version](https://badge.fury.io/js/gql-profiler.svg)](https://badge.fury.io/js/gql-profiler)

# GraphQL Profiler

A standalone performance profiler for GraphQL resolvers

## About The Apollo Suite

Before considering to use GraphQL Profiler, you might consider [Apollo Engine](https://www.apollographql.com/engine/) (or just [apollo-tracing-js](https://github.com/apollographql/apollo-tracing-js)).
These tools are more complete, more powerful and they are maintained by the awesome Apollo team.

But GraphQL Profiler has some advantages compared to the Apollo Suite:

- It's smaller, simpler and easier to hack
- It fits even non-standard use cases of GraphQL (like SSR, or server-to-server GraphQL communication)
- It's only about your resolvers, nothing else
- It's heavily customisable, you can [write your own reporter in 10 lines](#write-your-own-reporter)
- It allows to plug your own storage, no need to pay Apollo to host your data

## Getting Started

**Installation**

Add the profiler to your project dependencies:

```sh
# If you like npm
npm install --save gql-profiler
# or if you like yarn
yarn add gql-profiler
```

Choose a reporter, wrap your resolvers with the profiler, and use the reporter whenever you want:

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
  // wrap your resolvers with the profiler
  resolvers: profileResolvers(resolvers, { reporter }),
});

const app = express();

// add a route to display profiles
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

## Reporters

Available reporters: 

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

**nullReporter**

```js
import { nullReporter } from 'gql-reporter';
const reporter = nullReporter();
```

Does literaly nothing, and doesn't have useful API. Used in tests.

**More soon?**

- websocketReporter
- chromeDevtoolsReporter
- redisReporter
- traceEventFormatReporter

## Writing your own reporter

Writing a reporter is very simple, here is an example of a `consoleReporter`:

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

GraphQL Profiler is licensed under the [MIT License](https://github.com/marmelab/comfygure/blob/master/LICENSE), courtesy of [marmelab](http://marmelab.com) and [ARTE](https://www.arte.tv).
