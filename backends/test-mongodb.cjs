const { MongoClient } = require("mongodb");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Paste MongoDB connection string: ", async (uri) => {
    rl.close();

    const client = new MongoClient(uri.trim(), {
        serverSelectionTimeoutMS: 10000
    });

    try {
        await client.connect();

        console.log("MongoDB Connected Successfully!");

        const db = client.db("test");
        const collections = await db.listCollections().toArray();

        console.log("Database: test");
        console.log("Collections:", collections.length);
        console.log("Collection Names:");
        collections.forEach(c => console.log("-", c.name));

    } catch (error) {
        console.log("MongoDB Connection Failed!");
        console.log("Error:", error.message);
    } finally {
        await client.close();
    }
});