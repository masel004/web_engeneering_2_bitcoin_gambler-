package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.Transaction;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.TransactionType;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.BetRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.TransactionRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BetResolverService {

    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BitcoinService bitcoinService;

    public BetResolverService(BetRepository betRepository,
                              UserRepository userRepository,
                              TransactionRepository transactionRepository,
                              BitcoinService bitcoinService) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.bitcoinService = bitcoinService;
    }

    @Scheduled(fixedRate = 60000)
    public void resolveExpiredBets() {
        List<Bet> unresolvedBets = betRepository.findByResolvedFalse();
        if (unresolvedBets.isEmpty()) return;

        double currentPrice;
        try {
            currentPrice = bitcoinService.getBitcoinPrice();
        } catch (Exception e) {
            return;
        }

        for (Bet bet : unresolvedBets) {
            Duration timeframe = parseTimeframe(bet.getTimeframe());
            LocalDateTime expiresAt = bet.getPlacedAt().plus(timeframe);

            if (LocalDateTime.now().isAfter(expiresAt)) {
                boolean won;
                if (bet.getPrediction().equals("up")) {
                    won = currentPrice > bet.getPriceAtBet();
                } else {
                    won = currentPrice < bet.getPriceAtBet();
                }

                bet.setWon(won);
                bet.setResolved(true);
                betRepository.save(bet);

                if (won) {
                    User user = bet.getUser();
                    user.setBalance(user.getBalance() + bet.getAmount() * 2);
                    userRepository.save(user);

                    Transaction winTransaction = new Transaction();
                    winTransaction.setType(TransactionType.BET_WON);
                    winTransaction.setAmount(bet.getAmount() * 2);
                    winTransaction.setTimestamp(LocalDateTime.now());
                    winTransaction.setUser(user);
                    winTransaction.setBet(bet);
                    transactionRepository.save(winTransaction);
                }
            }
        }
    }

    private Duration parseTimeframe(String timeframe) {
        return switch (timeframe) {
            case "1m" -> Duration.ofMinutes(1);
            case "5m" -> Duration.ofMinutes(5);
            case "15m" -> Duration.ofMinutes(15);
            case "30m" -> Duration.ofMinutes(30);
            case "1h" -> Duration.ofHours(1);
            case "2h" -> Duration.ofHours(2);
            default -> Duration.ofMinutes(5);
        };
    }
}
