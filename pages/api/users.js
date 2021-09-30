import { MongoClient } from "mongodb";

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, score, createdAt } = req.body;

    const client = await MongoClient.connect(
      "mongodb://refresh:Ebubeagwaze44@cluster0-shard-00-00.y8eou.mongodb.net:27017,cluster0-shard-00-01.y8eou.mongodb.net:27017,cluster0-shard-00-02.y8eou.mongodb.net:27017/wordracing?ssl=true&replicaSet=atlas-7vp9wy-shard-0&authSource=admin&retryWrites=true&w=majority"
    );

    const db = client.db();

    const wordracingCollection = db.collection("wordracing");

    const result = await wordracingCollection.insertOne({
      name,
      score,
      createdAt
    });
    res.status(201).json({ message: "score added" });
    console.log(result);

    client.close();
  }
}

export default handler;
