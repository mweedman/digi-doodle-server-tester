# digi-doodle --- Built by Sophia Koeut | Michael Weedman | Jonathan Jackson | Austin Tumlinson | Daniel Kent

## About 

Lorem ipsum bla bla bla bla project description stuff here!

## Tech Stack:

FRONT END - 
<br/>
BACK END - 
<br/>
OTHER TOOLS -

## Repo & Live Server Links

[Live Server](url goes here in parentheses)
[Client Repo](url goes here in parentheses)
[Server Repo](url goes here in parentheses)

### Screenshots
![alt text here](screenshot link here and repeat as needed)


## Game lifecycle states
1. 'waiting for players'
> ```js
>	{
>		id: 'game uuid',
> 	current_drawer: null,
> 	current_answer: null,
> 	status: 'waiting for players',
> 	winner: null
> }
>```
2. 'standby'
> ```js
>	{
>		id: 'game uuid',
> 	current_drawer: 'drawer uuid', //drawer who is up next
> 	current_answer: null,
> 	status: 'standby',
> 	winner: null
> }
>```
2. 'drawing'
> ```js
>	{
>		id: 'game uuid',
> 	current_drawer: 'drawer uuid',
> 	current_answer: 'current answer',
> 	status: 'standby',
> 	winner: null
> }
>```
2. Game ended
> ```js
>	{
>		id: 'game uuid',
> 	current_drawer: 'drawer uuid',
> 	current_answer: 'current answer',
> 	status: 'standby',
> 	winner: 'winner username'
> }
>```


## /api/player - POST
Receives a username in a req.body and then writes a new user to the database. This returns the userID (UUID).

**Request Format**:
```json
{
	"username": "example-user-name"
}
```
**Success Response**
> Returns only the new user's id.
> **Code** : `200 OK`
> ```json
> "a2ddf32a-9a60-4075-8626-a85928e093af"
> ```

**Error Response**
>If a username is not provided: 
> **Code** : `404 `
> **Body**:
>```json
>{
>	"error": "Request must include a username"
>}
>```

>If a username is already taken: 
> **Code** : `404 `
> **Body**:
>```json
>{
>	"error": "Duplicate usernames are not allowed"
>}
>```

~~____________________________________________________~~

## /api/game/join - POST
Looks at all current games. If there is a game with an empty seat, it places the requesting player in that game and returns the game id. If there are no games with open seats, it will create a new game, place the player in it, and return the game id.

**Request Format**:
> ```json
> {
>   "playerId": "player id here",
>   "username": "username here",
> }
> ```

**Success Response**
> Returns the gameId of the game joined
> **Code** : `200 OK`
> ```json
> {
>   "gameId": "game uuid here",
> }
> ```

**Error Response**
>If user is already in a game
> **Code** : `404 `
> **Body**:
>```json
> {
>   "error": "You are already in a game"
> }
>```

~~____________________________________________________~~

## /api/game - GET
Retrieves all games from the database.

**Request Format**:
No body is required.

**Success Response**
> Returns an array of all games, or an empty array if there are no games.
> **Code** : `200 OK`
> ```json
> [
>   {
>     "id": "3cbe0b65-b96f-47e5-ac57-4d4fe50c29a5",
>     "canvas": "{canvas websocket URL}",
>     "current_drawer": {drawer UUID},
>     "current_answer": "fish",
>     "time_limit": 6000
>   },
>   {
>     "id": "3cbe0b65-dbeh-4tsh-lkdn-5d4gsg5s25rh1",
>     "canvas": "{canvas websocket URL}",
>     "current_drawer": {drawer UUID},
>     "current_answer: "potato",
>     "time_limit": 6000
>   }
> ]
> ```

**Error Response**
>No error handling thus far
>

~~____________________________________________________~~

## /api/game/guess - POST
Receives gameId, playerId, and guess. Eventually will return whether the guess is correct. For now is returning the created guess.

**Request Format**:
```json
{
	"gameId": "9756fb9f-e421-4ff1-ae3b-b16161625a26",
	"playerId": "cbc23c6a-4a83-4365-8c55-793a6ec8c59d",
	"guess": "potato"
}
```
**Success Response**
> For now returns the created guess. Eventually will evaluate whether the guess is correct or not.
> **Code** : `200 OK`
>```json
>[
>  {
>    "id": 3,
>    "guess": "potato",
>    "player_id": "cbc23c6a-4a83-4365-8c55-793a6ec8c59d",
>    "game_id": "9756fb9f-e421-4ff1-ae3b-b16161625a26"
>  }
>]
>```

**Error Response**
> No error catching thus far.

~~____________________________________________________~~

## /api/game/:game_id/player - GET
Returns all players' usernames and scores in a given game.

**Request Format**:
No request body required.

**Success Response**
> Returns an array of user objects.
> **Code** : `200 OK`
>```json
>[
>  {
>    "score": 12,
>		 "username": "first user name here",
>    "id": "row number for game_players table",
>    "player_id": "player uuid",
>    "game_id": "game uuid",
>    "next_player": "uuid of player who's turn is after this player's"
>  },
>  {
>    "score": 8,
>		 "username": "second username here",
>    "id": "row number for game_players table",
>    "player_id": "player uuid",
>    "game_id": "game uuid",
>    "next_player": "uuid of player who's turn is after this player's"
>  },
>]
>```

**Error Response**
> No error catching thus far.

~~____________________________________________________~~

## /api/game/:game_id/player - POST
Takes a player id and a username, and enters that player into the given game. Returns the created row with an initiated score of 0.

**Request Format**:
```json
{
	"playerId": "cefe3g34a-hth5-51dh-8c55-e1fw15wf19w",
	"username": "myusernamehere"
}
```
**Success Response**
> Returns the created row 
> **Code** : `204 No response`

**Error Response**
> No error catching thus far.

~~____________________________________________________~~

## /api/game/:game_id - PATCH
Takes any fields you wish to change in the game row. Returns the game with changes made.

**Request Format**:
```json
{
  "canvas": "updated canvas value",
  "current_drawer": "updated drawer"
}
```

**Success Response**
> Returns the created row 
> **Code** : `200 OK`
>```json
>{
>  "id": "original id",
>  "canvas": "updated canvas value",
>  "current_drawer": "updated drawer",
>  "current_answer": "original answer",
>  "time_limit": original time limit
>}
>```

**Error Response**
> **Code** : `400`
> If the db fails to return a value:
>```json
>{
>  "error": "Something when wrong when changing the game."
>}
>```

~~____________________________________________________~~

## /api/game/:game_id - DELETE
Deletes the given game, which cascades to delete all the guesses for that game, and the corresponding rows of the game_players table (scores).

**Request Format**:
No request body needed.

**Success Response**
> **Code** : `204 No response`
>

**Error Response**
> No current error catching

~~____________________________________________________~~

## /api/prompt - GET
Returns a random drawing prompt.

**Request Format**:
No request body needed.

**Success Response**
> Returns a random prompt
> **Code** : `200 OK`
>```json
>{
>  "prompt": "squirrel monkey"
>}
>```

**Error Response**
> No error catching for the moment.

~~____________________________________________________~~
