function pickLotteryWinners(data, numberOfTickets) {
  const winners = [];
  let i = 0;
  while (numberOfTickets > 0 && data.length > i) {
    winners.push[data.userId[i]];
    numberOfTickets - data.numberOfTickets[i];
  }
  return winners;
}
