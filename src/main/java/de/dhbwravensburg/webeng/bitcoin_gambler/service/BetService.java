package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.exception.InsufficientBalanceException;
import de.dhbwravensburg.webeng.bitcoin_gambler.exception.ResourceNotFoundException;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.*;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.BetRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.TransactionRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BitcoinService bitcoinService;

    public BetService(BetRepository betRepository,
                      UserRepository userRepository,
                      TransactionRepository transactionRepository,
                      BitcoinService bitcoinService) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.bitcoinService = bitcoinService;
    }

    public List<Bet> getAllBets() {
        return betRepository.findAll();
    }

    public Bet getBetById(Long id) {
        return betRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bet not found with id: " + id));
    }

    public List<Bet> getBetsByUserId(Long userId) {
        return betRepository.findByUserId(userId);
    }

    public Bet placeBet(Long userId, double amount, String prediction, String timeframe) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getBalance() < amount) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Current: " + user.getBalance() + ", Required: " + amount);
        }

        double currentPrice = bitcoinService.getBitcoinPrice();

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        Bet bet = new Bet();
        bet.setAmount(amount);
        bet.setPrediction(prediction);
        bet.setTimeframe(timeframe);
        bet.setPriceAtBet(currentPrice);
        bet.setResolved(false);
        bet.setWon(false);
        bet.setUser(user);
        bet.setPlacedAt(LocalDateTime.now());

        Bet savedBet = betRepository.save(bet);

        Transaction betTransaction = new Transaction();
        betTransaction.setType(TransactionType.BET_PLACED);
        betTransaction.setAmount(amount);
        betTransaction.setTimestamp(LocalDateTime.now());
        betTransaction.setUser(user);
        betTransaction.setBet(savedBet);
        transactionRepository.save(betTransaction);

        return savedBet;
    }
}
