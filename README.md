# Medication inventory API
### Requirements
- Docker
- Docker Compose
- Git

### Installation

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
### Running tests
```bash
npm install
npm run test:run
```
