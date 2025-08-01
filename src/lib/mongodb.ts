// src/lib/mongodb.ts

import { MongoClient, Db, Collection } from 'mongodb';
import { Roster, Person, RosterEvent } from './types';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('roster_management');
}

export async function getRostersCollection(): Promise<Collection<Roster>> {
  const db = await getDatabase();
  return db.collection<Roster>('rosters');
}

export async function getStaffCollection(): Promise<Collection<Person>> {
  const db = await getDatabase();
  return db.collection<Person>('staff');
}

export async function getEventsCollection(): Promise<Collection<RosterEvent>> {
  const db = await getDatabase();
  return db.collection<RosterEvent>('roster_events');
}

export default clientPromise;