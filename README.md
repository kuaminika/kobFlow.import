# kobFlow.import

Node/Express service that imports bank-statement CSVs for **kobFlow**. It turns CSV rows into expenses, guesses the merchant for each one, remembers those guesses per owner in MongoDB, and sends confirmed expenses to the kobFlow Expense API in bulk.

## How it works

```
CSV text ──► CSVParser ──► ExpenseModel[] ──► MerchantLookupService ──► expenses + merchant guesses
                                                 │
                                                 ├─ MerchantClassifier  (fuzzy match with Fuse.js against
                                                 │                       merchants from MERCHANT_GETALL_URL)
                                                 └─ MerchantMappingRepository (MongoDB, saved
                                                                          description → merchant mappings)

expenses ──► ExpenseService ──► POST {EXPENSE_API_BASE_URL}/Expense/BulkAdd
```

1. **Parse.** `CSVParser` reads the CSV with headers. It expects the columns `Filter`, `Date`, `Description`, `Sub-description`, `Type of Transaction` and `Amount` (a UTF-8 BOM on the first column is handled).
2. **Classify.** For each row, `MerchantLookupService.lookup` first fuzzy-matches the description against the owner's merchants (cached per owner, Fuse threshold `0.4`). If nothing matches, it looks for a saved mapping in MongoDB.
3. **Fall back.** Rows with no match get `DEFAULT_MERCHANT_ID`. Every row gets `DEFAULT_CATEGORY_ID` and `KOB_HOLDER_ID` (all default to `1`).
4. **Remember.** Matches from the import **replace** all of the owner's stored mappings (`renewMappings` deletes everything for the owner, then inserts the new set).
5. **Insert.** The client reviews the parsed expenses and sends them back to `/bulk-insert-expenses`, which forwards them to the Expense API.

## API

All request bodies are JSON (`Content-Type: application/json`).

| Method | Path | Body | Response |
| ------ | ---- | ---- | -------- |
| `GET`  | `/health` | — | `ok` |
| `POST` | `/parse-csv-expenses` | `{ "csvContent": "<raw csv>", "ownerId": 1 }` | `{ "expenses": [ ... ] }` |
| `POST` | `/bulk-insert-expenses` | `{ "expenses": [ ... ] }` | `{ "message": "Bulk insert successful" }` |
| `GET`  | `/mappings/:ownerId` | — | Array of stored mappings |
| `POST` | `/mappings/:ownerId` | `{ "mapping": { "rawDescription", "merchantId", "merchantName", ... } }` | `{ "message": "Mapping added successfully", "mappingAdded": ... }` |
| `PUT` | `/mappings/:ownerId` | `{ "mapping": { "rawDescription", ...fields to update } }` | `{ "message": "Mapping updated successfully", "mappingUpdated": ... }` |
| `DELETE` | `/mappings/:ownerId` | `{ "mapping": { "rawDescription" } }` | `{ "message": "Mapping deleted successfully", "mappingDeleted": ... }` |
| `POST` | `/updateMappings/:ownerId` | `{ "mappings": [ { "rawDescription", "merchantId", "merchantName", ... } ] }` or an object keyed by description | `{ "message": "Mappings updated successfully" }` |

Example:

```bash
curl -X POST http://localhost:3000/parse-csv-expenses \
  -H "Content-Type: application/json" \
  -d '{"ownerId":1,"csvContent":"Filter,Date,Description,Sub-description,Status,Type of Transaction,Amount\n,2026-02-27,adobe,San Jose 065,posted,Debit,29.88"}'
```

### Mapping document (MongoDB `merchantmappings`)

| Field | Type | Notes |
| ----- | ---- | ----- |
| `rawDescription` | String | Required. Unique together with `ownerId`. |
| `ownerId` | Number | Required |
| `merchantId` | Number | Required |
| `merchantName` | String | Required |
| `confidence` | Number | Fuse score (lower is a closer match) |
| `confirmedByUser` | Boolean | Defaults to `false` |
| `createdAt` / `updatedAt` | Date | |

## Getting started

### Prerequisites

- Node.js 20 (the version used in deployment)
- A MongoDB Atlas cluster (the connection string is built as `mongodb+srv://`)
- A running kobFlow Expense API and merchant endpoint

### Configure

Copy the sample env file and fill in real values:

```bash
cp .env.sample.txt .env
```

| Variable | Purpose |
| -------- | ------- |
| `HTTP_PORT` | Port the service listens on (default sample: `3000`) |
| `SERVICE_NAME`, `APPLICATION_NAME` | Shown in logs |
| `CORS_ORIGIN` | Allowed CORS origin (`*` for any) |
| `EXPENSE_API_BASE_URL` | kobFlow Expense API base URL |
| `EXPENSE_API_KEY` | Not used yet: the Expense API doesn't require a key, so `configs.js` doesn't read it |
| `MERCHANT_GETALL_URL`, `MERCHANT_API_KEY` | Endpoint that returns `{ subject: [{ id, name }, ...] }` merchants |
| `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_HOST`, `MONGO_DB_NAME`, `MONGO_CLUSTER_NAME` | MongoDB Atlas connection |
| `DEFAULT_ORG_ID` | Default organisation id |
| `OWNER_ID` | Optional default owner |

Never commit `.env`. It is listed in `.gitignore`.

### Run locally

```bash
npm install
node src/index.js
```

### Run with Docker

```bash
docker compose up --build        # service on http://localhost:5011
docker compose watch             # same, and syncs ./src and restarts on change
```

The container listens on `3000`; `docker-compose.yml` maps it to host port `5011` and loads `.env`.

## Tests

There is no test runner yet. The files in [src/tests/](src/tests/) are standalone scripts you run by hand. Most of them need a valid `.env` and access to the network or database.

```bash
node src/tests/testMerchantMappingCRUD.js  # mapping CRUD with an in-memory model
node src/tests/testCSVParser.js           # CSV parsing only
node src/tests/testMerchantClassifier.js  # classification against src/tests/data/merchants.json
node src/tests/ImportServiceTester.js     # full import pipeline (MongoDB + merchant API)
node src/tests/testExpenseService.js      # Expense API calls
node src/tests/testMongooseConnect.js     # database connectivity
node src/tests/testLogger.js              # LogTool output
```

## Project layout

```
src/
├── index.js                   # entry point
├── AppInitiator.js            # wires services and controllers, defines routes, starts Express
├── configs.js                 # reads .env into a config object
├── *Controller.js             # HTTP handlers (import, merchant mappings, health)
├── MerchantMappingRepository.js
├── LogTool.js                 # pino-based logger
├── factories/                 # build services with their dependencies
├── services/                  # ImportService, MerchantLookupService, ExpenseService
├── util/                      # APIClient, CSVParser, MerchantClassifier, DB connectors
├── models/ExpenseModel.js
├── mongooseModels/MerchantMapping.js
└── tests/                     # manual test scripts and sample data
```

## Deployment

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) deploys on every push:

- `dev*` branches go to the **DEV** GitHub environment
- `main` goes to **PROD**

The job connects to the server over SSH, pulls the branch, writes `.env` from GitHub environment variables and secrets, runs `npm install --production` on Node 20, and reloads the app with PM2 ([ecosystem.config.cjs](ecosystem.config.cjs)).

Each environment needs:

- **Variables:** `ENV_DIR`, `SERVER_USER`, `HTTP_PORT`, `SERVICE_NAME`, `APPLICATION_NAME`, `EXPENSE_API_BASE_URL`, `MERCHANT_GETALL_URL`, `CORS_ORIGIN`, `DEFAULT_ORG_ID`, and the `MONGO_*` values
- **Secrets:** `SERVER_HOST`, `SERVER_SSH_PORT`, `SERVER_SSH_KEY`, `KOBFLOW_SERVICES_TOKEN`, `EXPENSE_API_KEY`, `MERCHANT_API_KEY`, `MONGO_PASSWORD`
