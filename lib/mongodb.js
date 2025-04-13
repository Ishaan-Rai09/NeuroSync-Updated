/**
 * Mock MongoDB module - prevents errors when trying to use MongoDB
 * All data is actually stored on Pinata IPFS now
 */

// This function is a no-op that returns a mock DB object
export const connectToDatabase = async () => {
  console.log('MongoDB connection bypassed - using Pinata IPFS instead');
  
  // Return a mock DB object
  return {
    db: {
      collection: (name) => ({
        // Mock collection methods that return empty results
        findOne: async () => null,
        find: async () => ({ toArray: async () => [] }),
        insertOne: async () => ({ insertedId: 'mock-id' }),
        updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
        deleteOne: async () => ({ deletedCount: 1 }),
        deleteMany: async () => ({ deletedCount: 1 })
      })
    }
  };
};

// Export a mock client promise
const clientPromise = Promise.resolve({
  db: () => ({
    collection: () => ({
      findOne: async () => null,
      find: async () => ({ toArray: async () => [] }),
      insertOne: async () => ({ insertedId: 'mock-id' }),
      updateOne: async () => ({ matchedCount: 1, modifiedCount: 1 }),
      deleteOne: async () => ({ deletedCount: 1 }),
      deleteMany: async () => ({ deletedCount: 1 })
    })
  })
});

export default clientPromise; 