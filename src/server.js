import { ApolloServer } from 'apollo-server-express';
import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import {graphqlUploadExpress} from 'graphql-upload'
import express from 'express';
import http from 'http';
import cors from 'cors';

import "#config/index"

console.log(process.env.PG_USER);


import schema from "./modules/index.js"

async function startApolloServer() {
    const app = express();
    app.use(express.static('uploads'));
    app.use(graphqlUploadExpress())
    app.use(cors())
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        context: ({ req }) => {
            return req
        },
        uploads: {
            maxFileSize: 50000000, // 50 MB
            maxFiles: 30,
            maxFieldSize: 50000000 // 50 MB
        },
        csrfPrevention: false,
        schema,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            ApolloServerPluginLandingPageGraphQLPlayground()
        ],
    });
    await server.start();
    server.applyMiddleware({
        app,
        path: "/graphql"
    });
    await new Promise(resolve => httpServer.listen({ port: process.env.PORT || 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}
startApolloServer()