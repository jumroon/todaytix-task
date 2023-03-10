# Task 1, Lottery Picking Algorithm

## Proposed/assumed table

```
CREATE TABLE lottery_entries (
  user_id INTEGER PRIMARY KEY NOT NULL REFERENCES users_table(user_id),
  lottery_id INTEGER NOT NULL REFERENCES lottery_table(lottery_id),
  number_tickets INTEGER NOT NULL,
  show_ids INTEGER[] REFERENCES showings_table(show_id),
  winning_show_id INTEGER DEFAULT NULL
);

```

### Explanation

- `user_id`: individual user id, references a table of users.
- `lottery_id`: id of the lottery that the contestants are entering. For example, Harry Potter may have multiple showings at different venues and/or different times. All the showings for Harry Potter have the same lottery id, regardless of the time or venue.
- `number_tickets`: number of tickets user wants to win. The maximum value can be set by the API user. In theory, the algorithm can work with any number of tickets. There are no partial wins - the user either wins the number of tickets they entered for or they do not win any tickets.
- `show_ids`: id for a particular showing, for example Harry Potter, at Broadway Theater on Wednesday November 7 has a unique `show_id`. `show_ids` is an array because participants may choose multiple showings to enter for.
- `winning_show_id`: indicates whether the entry won tickets for a show. Contains the `show_id` if the entry is a winner and `NULL` otherwise.

---

## Lottery picking:

```
SELECT *
FROM lottery_entries
WHERE lottery_id = <lottery_id> AND <show_id> = ANY(show_ids) AND user_id IN (
  SELECT DISTINCT user_id
  FROM lottery_entries
  WHERE lottery_id = <lotteryId> AND winning_show_id = NULL
)
ORDER BY random() LIMIT <limit>;
```

### Explanation:

This is an SQL query that selects a `<limit>` number of users in a random order.

> Trade-offs to having a limit or not. If there is no limit, returning every user means that the algorithm can go through every user and raises chance that all the tickets will be given away. However, without a limit the query will be more costly.

An algorithm is used to pick winners from the list returned from the SQL query. Algorithm goes through each entry in the list and puts winners into an array using the following criteria:

- If the the total number of tickets given out (`ticketsGivenOut`) will be smaller than or equal to the total number of tickets to give away (`numberOfTickets`) after selecting the user as winner, the user is added to the list of winners.
- If the the total number of tickets given out will exceed to the total number of tickets to give away after selecting the user as winner, the user is not added to the list of winners.

## Algorithm

```
function pickLotteryWinners(entries, numberOfTickets) {
  const winners = [];
  let ticketsGivenOut = 0;
  entries.forEach((entry) => {
    if (
      ticketsGivenOut <= numberOfTickets &&
      entry.number_tickets + ticketsGivenOut <= numberOfTickets
    ) {
      ticketsGivenOut += entry.number_tickets;
      winners.push(entry.user_id);
    }
  });
  return { winners, ticketsGivenOut };
}

```

## API Endpoints

### Enter the lottery

**`POST`**

- Path: /lotteries/`<lottery_id>`

- Description: enter specific lottery, user chooses number of tickets and showings.

- Example payload:

```
{
  "user_id": 1,
  "lottery_id": 1,
  "number_tickets": 2,
  "show_id": [1, 2],
}
```

### Pick Lottery Winners

**`PUT`**

- Path: /admin/lotteries/`<lottery_id>`/pickWinners

- Description: secure path for admin. Pick lottery winners. Calling this API runs the `pickLotteryWinners` function for each `show_id` belonging to the lottey. It updates `winning_show_id` for each user selected as a winner.

### Get Lottery Winners

**`GET`**

- Path: /admin/lotteries/`<lottery_id>`/winners

- Description: request for retrieving all the winners from a lottery of `<lottery_id>`.

- Example response:

```
[
  {
    "user_id": 1,
    "lottery_id": 1,
    "number_tickets": 2,
    "show_id": [1, 2],
    "winning_show_id": 2
  },
  {
    "user_id": 2,
    "lottery_id": 1,
    "number_tickets": 1,
    "show_id": [1],
    "winning_show_id": 1
  },
  {
    "user_id": 3,
    "lottery_id": 1,
    "number_tickets": 2,
    "show_id": [1, 2, 3, 5],
    "winning_show_id": 3
  }
]
```

## Usage Example

1. The client app uses `POST /lotteries/<lottery_id>` endpoint to allow users to enter the lottery.
2. At a predetermined time, the server calls `PUT /admin/lotteries/<lottery_id>/pickWinners` to select winners.
3. `GET /admin/lotteries/<lottery_id>/winners` can be used to display the list of winners in the admin app or to automatically notify the winners.
