const fs = require("fs");

let rawdata = fs.readFileSync("./00-lottery.json");
let lottery_data = JSON.parse(rawdata);
console.log(lottery_data);

function pickLotteryWinners(entries, numberOfTickets) {
  const winners = [];
  console.log("winnerssssss", winners);
  let ticketsGivenOut = 0;
  console.log("entriesssss", entries);
  entries.forEach((entry) => {
    if (
      ticketsGivenOut <= numberOfTickets &&
      entry.number_tickets + ticketsGivenOut <= numberOfTickets
    ) {
      console.log("entry------", entry);
      ticketsGivenOut += entry.number_tickets;
      winners.push(entry.user_id);
    }
  });
  console.log("TICKETS GIVEN OUT", ticketsGivenOut);
  return { winners, ticketsGivenOut };
}

console.log(pickLotteryWinners(lottery_data, 3));
