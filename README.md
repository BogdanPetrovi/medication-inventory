# Medication inventory API
## Requirements
- Docker
- Docker Compose
- Git

## Installation

1. Clone the repository

```
git clone https://github.com/BogdanPetrovi/medication-inventory.git
cd medication-inventory
```
2. Only for windows to avoid "no such file or directory"
```
dos2unix docker-entrypoint.sh
```
3. Start the application
```
docker compose up --build
```
## Running tests
```bash
npm install
npm run test:run
```
## API Endpoints

Base URL:

```
/api
```

---

### ***`GET /medications`***

Returns a paginated list of medications.

#### Query Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| limit     | number | No | Number of records to return |
| offset    | number | No | Number of records to skip |
| schedule  | enum   | No | II \| III \| IV \| V |

#### Example

```
GET /medications?limit=10&offset=0
GET /medications?schedule=II
```

#### Response example

```json
[
  {
    "id": 1,
    "name": "Oxycodone",
    "currentStockQuantity": 100,
    "schedule": "II",
    "unit": "mg"
  }
]
```

---

### ***`GET /medications/:id`***

Returns a single medication by ID including its transactions.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Medication ID |

#### Example

```
GET /medications/1
```

#### Response

```json
{
  "id": 1,
  "name": "Oxycodone",
  "currentStockQuantity": 95,
  "schedule": "II",
  "transaction": [
     {
       "id": 1,
       "medicationId": 1,
       "nurseId": 3,
       "witnessId": 2,
       "type": "CHECKOUT",
       "quantity": 55,
       "notes": null,
       "timestamp": "2026-02-23T12:10:25.327Z"
     }
  ]
}
```

#### Errors

- `404` – Medication not found

---

### ***`POST /transactions`***

Creates a new transaction and updates medication stock.

#### Request Body

```json
{
  "medicationId": 1,
  "nurseId": 2,
  "witnessId": 3,
  "type": "CHECKOUT",
  "quantity": 5,
  "notes": "Administered to patient"
}
```

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| medicationId | number | Yes | Medication ID |
| nurseId | number | Yes | Must have role `NURSE` |
| witnessId | number | Yes | Must have role `WITNESS` |
| type | enum | Yes | CHECKOUT \| RETURN \| WASTE (doesn't change stock) |
| quantity | number | Yes | Quantity to update |
| notes | string | No | Additional notes, required for `WASTE` |

#### Business Rules

- Nurse and Witness must be different
- Nurse role must be `NURSE`
- Witness role must be `WITNESS`
- CHECKOUT fails if insufficient stock
- Each transaction creates an audit log entry

#### Response

```json
{
  "message": "Successfully created transaction"
}
```

#### Errors

- `400` – Invalid nurse or witness
- `404` – Medication not found
- `409` – Not enough stock

---

### ***`GET /transactions`***

Returns a paginated list of transactions.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of records |
| offset | number | No | Records to skip |
| type | enum | No | CHECKOUT \| RETURN \| WASTE |
| medicationId | number | No | Filter by medication |

#### Example

```
GET /transactions?type=CHECKOUT
GET /transactions?medicationId=1&limit=20
```

#### Response

```json
[
  {
    "id": 1,
    "medicationId": 1,
    "nurseId": 2,
    "witnessId": 3,
    "type": "CHECKOUT",
    "quantity": 5,
    "notes": "Administered to patient",
    "timestamp": "2026-02-23T12:10:25.327Z"
  }
]
```

---

### ***`GET /audit-log`***

Returns audit log entries.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of records |
| offset | number | No | Records to skip |
| entityType | string | No | Filter by entity type |

#### Example

```
GET /audit-log
GET /audit-log?entityType=Transaction
```

#### Response

```json
[
  {
    "id": 5,
    "action": "CREATED_TRANSACTION",
    "entityType": "Transaction",
    "entityId": 10,
    "performedBy": 2,
    "details": {
      "oldStockQuantity": 100,
      "newStockQuantity": 95,
      "unit": "mg",
      "nurseId": 2,
      "witnessId": 3,
      "notes": "Administered to patient"
    },
    "timestamp": "2026-02-23T12:10:25.327Z"
  }
]
```

---