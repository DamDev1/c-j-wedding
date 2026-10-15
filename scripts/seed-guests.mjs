import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Simple fallback parser for .env.local if not already in process.env
function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "wedding";

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not defined in .env.local");
  console.error("Please add your MongoDB connection string to .env.local:\n  MONGODB_URI=\"mongodb+srv://...\"\n");
  process.exit(1);
}

const WHITELISTED_NUMBERS = [
  "08097864797",
  "08095697867",
  "07030091114",
  "08068382470",
  "09059383335",
  "08059107021",
  "08153870131",
  "08036460456",
  "07061898994",
  "08179602211",
  "08076791047",
  "08104533142",
  "09069183159",
  "08133314070",
  "08035532885",
  "09034958987",
  "08035154576",
  "08162169063",
  "07031041686",
  "08130501169",
  "08146552187",
  "08033364779",
  "08063667627",
  "08077377514",
  "08033826999",
  "08063059886",
  "08093131158",
  "08038791102",
  "08025810204",
  "08119745230",
  "08065336049",
  "07062020465",
  "08036021160",
  "09060777201",
  "07059259967",
  "09076750124",
  "08038545421",
  "07030335800",
  "08146012080",
  "08097688672",
  "07060597120",
  "08133973364",
  "09031558224",
  "08068406757",
  "08065983630",
  "08039175613",
  "08032272758",
  "08137792763",
  "08053191284",
  "09096660997",
  "08095655645",
  "08033182997",
  "08102462685",
  "08169018299",
  "08161997165",
  "08023025619",
  "08100075660",
  "08033219719",
  "08101771065",
  "08052934729",
  "07038286308",
  "08056841906",
  "08179791717",
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully.");

    const db = client.db(dbName);
    const guests = db.collection("guests");

    // Ensure index on phone
    await guests.createIndex({ phone: 1 }, { unique: true });

    let inserted = 0;
    let existing = 0;

    for (const phone of WHITELISTED_NUMBERS) {
      const result = await guests.updateOne(
        { phone },
        {
          $setOnInsert: {
            phone,
            isUsed: false,
            deviceId: null,
            usedAt: null,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        existing++;
      }
    }

    console.log(`✅ Seeding complete!`);
    console.log(`   - New numbers added: ${inserted}`);
    console.log(`   - Existing numbers kept: ${existing}`);
    console.log(`   - Total whitelisted numbers: ${WHITELISTED_NUMBERS.length}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await client.close();
  }
}

seed();
