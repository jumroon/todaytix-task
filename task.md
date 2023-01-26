# Task 1, Lottery Picking Algorithm

## Proposed/assumed table

```
CREATE TABLE lottery_entries (
userID UUID NOT NULL DEFAULT gen_random_uuid(),
lotteryID INTEGER NOT NULL,
number_tickets INTEGER NOT NULL,
showID INTEGER[] NOT NULL,
is_winner BOOLEAN NOT NULL,
PRIMARY KEY (userID, lotteryID, showID)
);
```

**Explanation**

- UserId: individual userIds
- lotteryId: Id of a particular lottery that the contestants are entering. lottery for Harry Potter (all dates) has its own lotteryId
- number_tickets: number of tickets user wants to win
- showID: for particular show (e.g. tuesday nov 7, 2022, harry potter, specific show ID). it is an array type because one person may click okay to many different dates
- is_winner: boolean of true/false. this is to make sure that once they win a lottery they are not entered to win other lotteries for the same show (i.e. the assumption is if you win tickets to go watch harry potter on nov 7, you cant also win tickets for wed, thur, friday etc. In real life this may be irrelevant if they can win tickets for many showings for the same show)

---

## Lottery picking:

```
SELECT *
FROM lottery_entries
WHERE lottery_id = lotteryId AND show_id IN (showId we are drawing for) AND userid NOT IN (
SELECT DISTINCT userId
FROM lottery_entries
WHERE lotter_id = lotteryId AND is_winner = true
)
ORDER BY random() LIMIT [limitHere];
```

**Explanation**

This is a single SQL query that does two things. The first main thing it does is that it selects a certain number of users in a random order. This is already 'lottery picking' in a way. If there are 1000 entries but only 100 tickets to give out, it probably does not make sense to return 1000 entries. The idea is the the number of entries that are returned relates to number of tickets given out. For the ease of explanation let's assume we have 100 tickets to give out and so we LIMIT it to 100 (as each person will want at least 1 ticket).

**Algorithm**

Algorithm to pick the winners from the list, adding them up until a certain number of tickets is achieved or we run out of people in the given array. For example, if there are 10 tickets to give out, and we have given out 9 of them, and everyone else in the lottery wants at least two tickets, we stop once we've looped through the data.

```
function pickLotteryWinners(data, numberOfTickets) {
  const winners = [];
  let i = 0;
  while (numberOfTickets > 0 && data.length > i) {
    winners.push[data.userId[i]];
    numberOfTickets - data.numberOfTickets[i];
  }
  return winners;
}
```
