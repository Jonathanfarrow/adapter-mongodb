import { MongoFilter, MongoProjection, MongoReadPreference, MongoReadPreferenceSchema, MongoSort } from '@nodescript/adapter-mongodb-protocol';
import { ModuleCompute, ModuleDefinition } from '@nodescript/core/types';

import { requireConnection } from '../lib/MongoDbConnection.js';

interface P {
    connection: unknown;
    collection: string;
    filter: MongoFilter;
    projection: MongoProjection;
    sort: MongoSort;
    readPreference: MongoReadPreference;
}
type R = Promise<unknown>;

export const module: ModuleDefinition<P, R> = {
    version: '2.2.5',
    moduleName: 'Mongo DB / Find One',
    description: 'Finds one document in specified MongoDB collection.',
    keywords: ['mongodb', 'database', 'find', 'query'],
    params: {
        connection: {
            schema: { type: 'any' },
            hideValue: true,
        },
        collection: {
            schema: { type: 'string' },
        },
        filter: {
            schema: {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'any' },
            },
        },
        projection: {
            schema: {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'any' },
            },
            advanced: true,
        },
        sort: {
            schema: {
                type: 'object',
                properties: {},
                additionalProperties: { type: 'any' },
            },
            advanced: true,
        },
        readPreference: {
            schema: MongoReadPreferenceSchema.schema,
            advanced: true,
        },
    },
    result: {
        async: true,
        schema: { type: 'any' },
    },
    evalMode: 'manual',
    cacheMode: 'always',
};

export const compute: ModuleCompute<P, R> = async params => {
    const connection = requireConnection(params.connection);
    const collection = params.collection;
    const filter = params.filter;
    const projection = Object.keys(params.projection).length > 0 ? params.projection : undefined;
    const sort = Object.keys(params.sort).length > 0 ? params.sort : undefined;
    const { document } = await connection.Mongo.findOne({
        databaseUrl: connection.databaseUrl,
        collection,
        filter,
        projection,
        sort,
        readPreference: params.readPreference || 'primary',
    });
    return document;
};
