# Task 1, Lottery Picking Algorithm

## Proposed/assumed table

```
CREATE TABLE lottery_entries (
  user_id INTEGER PRIMARY KEY NOT NULL REFERENCES users_table(user_id),
  lottery_id INTEGER NOT NULL REFERENCES lottery_table(lottery_id),
  number_tickets INTEGER NOT NULL,
  show_id INTEGER[] REFERENCES showings_table(show_id),
  is_winner BOOLEAN NOT NULL DEFAULT false
);

```

**Explanation**

- `user_id`: individual userIds, references a general table of users
- `lottery_id`: Id of a particular lottery that the contestants are entering. For example, Harry Potter may have multiple showings at different venues and/or different times. All the showings for Harry Potter have the same lotteryId, despite the time or venue.
- `number_tickets`: number of tickets user wants to win
- `show_id`: show_id for a particular showing, for example Harry Potter, at Broadway Theater on Wednesday November 7 has a unique show_id. As array because participants may choose multiple showings to enter for.
- `is_winner`: boolean of true/false. Used to ensure a winner of a lottery is not entered for other showings of the same show. In real life this may be irrelevant if a participant can win tickets for many showings for the same show.

---

## Lottery picking:

```
SELECT *
FROM lottery_entries
WHERE lottery_id = <lottery_id> AND show_id IN (showId we are drawing for) AND user_id NOT IN (
  SELECT DISTINCT user_id
  FROM lottery_entries
  WHERE lotter_id = <lotteryId> AND is_winner = true
)
ORDER BY random() LIMIT <limit>;
```

**Explanation**

This is a single SQL query that selects randomly a certain number of users in a random order.

Limit: trade-offs to having a limit or not. If there is no limit, returning every user means that the algorithm can go through every user and raises chance that all the tickets will be given away. However, without a limit the query will be more costly.

Another algorithm to pick winners from the list returned from the SQL query. Algorithm goes through each entry in the list and puts winners into an array until one of the two conditions are met:

- ticketsGivenOut are equal to numberOfTickets
- in the next entry adding those tickets to ticketsGiven out will be larger than number of tickets that can be given out.

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

**Use Example**

- SQL query to create lottery_entries table

- SELECT query to return randomly ordered entries

- pick winners
  `const winners = pickLotteryWinners(entries, 100);`

- query marks winners in the database
  `markAsWinnersInTheDatabase(winners)`
