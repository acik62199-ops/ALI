# 😂 Joke Generator API

Random joke generator using Official Joke API.

## Endpoints

### Get Random Joke
```bash
GET /api/jokes/random
```
Response:
```json
{
  "joke": "Why don't scientists trust atoms? Because they make up everything!",
  "setup": "Why don't scientists trust atoms?",
  "punchline": "Because they make up everything!",
  "type": "general"
}
```

### Get Joke by Type
```bash
GET /api/jokes/type/programming
```
Types: `general`, `knock-knock`, `programming`

### Get Multiple Jokes
```bash
GET /api/jokes/multiple/5
```

### Get All Joke Types
```bash
GET /api/jokes/types/list
```

## Test It
```bash
curl http://localhost:5000/api/jokes/random
```

## Frontend
```bash
npm install axios react
# Use JokeGenerator.jsx component
```

✅ **Setup Complete!**