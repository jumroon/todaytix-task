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

**Explanation**

- `user_id`: individual user id, references a table of users
- `lottery_id`: id of a particular lottery that the contestants are entering. For example, Harry Potter may have multiple showings at different venues and/or different times. All the showings for Harry Potter have the same lottery id, regardless of the time or venue.
- `number_tickets`: number of tickets user wants to win. The maximum value can be set by the API user. In theory, the algorithm can work with any number of tickets.
- `show_ids`: id for a particular showing, for example Harry Potter, at Broadway Theater on Wednesday November 7 has a unique `show_id`. `show_ids` is an array because participants may choose multiple showings to enter for.
- `winning_show_id`: indicates whether the entry won tickets for a show. Contains the `show_id` if the entry is a winner and `NULL` otherwise.

---

## Lottery picking:

```
SELECT *
FROM lottery_entries
WHERE lottery_id = <lottery_id> AND show_id IN <show_id> = ANY(show_ids) AND user_id IN (
  SELECT DISTINCT user_id
  FROM lottery_entries
  WHERE lottery_id = <lotteryId> AND winning_show_id = NULL
)
ORDER BY random() LIMIT <limit>;
```

**Explanation**

This is an SQL query that selects randomly a `<limit>` number of users in a random order.

Limit: trade-offs to having a limit or not. If there is no limit, returning every user means that the algorithm can go through every user and raises chance that all the tickets will be given away. However, without a limit the query will be more costly.

An algorithm is used to pick winners from the list returned from the SQL query. Algorithm goes through each entry in the list and puts winners into an array using the following criteria:

- If the the total number of tickets given out (`ticketsGivenOut`) will be smaller than or equal to the total number of tickets to give away (`numberOfTickets`) after selecting the user as winner, the user is added to the list of winners.
- If the the total number of tickets given out will exceed to the total number of tickets to give away after selecting the user as winner, the user is not added to the list of winners.

**Algorithm**

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

**API Endpoints**

- `POST`
  Path: /lotteries/`<lottery_id>`

  Description: enter specific lottery, user chooses number of tickets and showings

  Data sent:

```
{
"user_id": 1,
"lottery_id": 1,
"number_tickets": 2,
"show_id": [1, 2],
}
```

- `PUT`
  Path: /admin/lotteries/`<lottery_id>`/pickWinners

  Description: secure path for admin. Pick lottery winners, update winning_show_id params

- `GET`
  Path: /admin/lotteries/`<lottery_id>`/winners

  Description: request for retrieving all the winners from a lottery of `<lottery_id>`

**Implementation**

- Query the database with the query provided to retrieve the list of potential winners for a showing.
- Pick the winners using the `pickLotteryWinners` function.
- For each winner, set `winning_show_id` in the `lottery_entries` table.
- To retrieve all winners of a specific lottery, regardless of the showing, select all users where `lottery_id` is equal to the id of the lottery and `winning_show_id` is not `NULL`.

**Use Example**

- SQL query to create lottery_entries table

- SELECT query to return randomly ordered entries

- pick winners
  `const winners = pickLotteryWinners(entries, 100);`

- query marks winners in the database
  `markAsWinnersInTheDatabase(winners)`
