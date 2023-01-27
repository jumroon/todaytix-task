const fs = require("fs");

let rawdata = fs.readFileSync("./00-lottery.json");
let lottery_data = JSON.parse(rawdata);

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

console.log(pickLotteryWinners(lottery_data, 3));
