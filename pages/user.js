import { MongoClient } from "mongodb";
import moment from "moment";

function User({ wordRacing }) {
  return (
    <div className="root">
      <div className="container">
        <h1>TOP SCORES</h1>
        <div>
          {wordRacing.map(word => (
            <div key={word.id} className="total-scores">
              <span>{word.name}</span>
              <span className="wpm">{word.score} WPM</span>
              <span>{moment(word.createdAt).format("DD/MM/YYYY")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb://refresh:Ebubeagwaze44@cluster0-shard-00-00.y8eou.mongodb.net:27017,cluster0-shard-00-01.y8eou.mongodb.net:27017,cluster0-shard-00-02.y8eou.mongodb.net:27017/wordracing?ssl=true&replicaSet=atlas-7vp9wy-shard-0&authSource=admin&retryWrites=true&w=majority"
  );

  const db = client.db();

  const wordracingCollection = db.collection("wordracing");
  const wordRacing = await wordracingCollection
    .find()
    .sort({ score: -1 })
    .toArray();

  client.close();

  return {
    props: {
      wordRacing: wordRacing.map(word => ({
        id: word._id.toString(),
        name: word.name,
        score: word.score,
        createdAt: word.createdAt
      }))
    }
  };
}

export default User;
