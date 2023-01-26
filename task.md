# Task 1, Lottery Picking Algorithm

## Proposed/assumed table

```
CREATE TABLE lottery_entries (
  user_id NOT NULL REFERENCES user_id in users_table ,
  lottery_id INTEGER NOT NULL REFERENCES lottery_id in lottery_table,
  number_tickets INTEGER NOT NULL,
  show_id INTEGER[] NOT NULL references show_id in shows_table,
  is_winner BOOLEAN NOT NULL,
  PRIMARY KEY (user_id, lottery_id, show_id)
);
```

**Explanation**

- user_id: individual userIds, references a general table of users
- lottery_id: Id of a particular lottery that the contestants are entering. For example, Harry Potter may have multiple showings at different venues and/or different times. All the showings for Harry Potter have the same lotteryId, despite the time or venue.
- number_tickets: number of tickets user wants to win
- show_id: show_id for a particular showing, for example Harry Potter, at Broadway Theater on Wednesday November 7 has a unique show_id. As array because participants may choose multiple showings to enter for.
- is_winner: boolean of true/false. Used to ensure a winner of a lottery is not entered for other showings of the same show. In real life this may be irrelevant if a participant can win tickets for many showings for the same show.

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

  const ticketsGivenOut = 0;

  entries.forEach((entry) => {
    if (ticketsGivenOut <= numberOfTickets && entry.numberOfTickets + ticketsGivenOut <= numberOfTickets) {
      ticketsGivenOut += entry.numberOfTickets;
      winners.push(entry);
    }
  });

  return winners;
}
```

**Use Example**

- pick winners
  const winners = pickLotteryWinners(entries, 100);

- query marks winners in the database
  markAsWinnersInTheDatabase(winners)