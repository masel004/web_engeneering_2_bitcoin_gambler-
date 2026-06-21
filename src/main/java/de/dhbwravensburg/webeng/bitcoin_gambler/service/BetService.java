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

    public BetService(BetRepository betRepository,
                      UserRepository userRepository,
                      TransactionRepository transactionRepository) {
        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
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

    public Bet placeBet(Long userId, double amount, String prediction) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getBalance() < amount) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Current: " + user.getBalance() + ", Required: " + amount);
        }

        user.setBalance(user.getBalance() - amount);

        boolean won = Math.random() > 0.5;

        if (won) {
            user.setBalance(user.getBalance() + amount * 2);
        }

        Bet bet = new Bet();
        bet.setAmount(amount);
        bet.setPrediction(prediction);
        bet.setWon(won);
        bet.setUser(user);
        bet.setPlacedAt(LocalDateTime.now());

        userRepository.save(user);
        Bet savedBet = betRepository.save(bet);

        Transaction betTransaction = new Transaction();
        betTransaction.setType(TransactionType.BET_PLACED);
        betTransaction.setAmount(amount);
        betTransaction.setTimestamp(LocalDateTime.now());
        betTransaction.setUser(user);
        betTransaction.setBet(savedBet);
        transactionRepository.save(betTransaction);

        if (won) {
            Transaction winTransaction = new Transaction();
            winTransaction.setType(TransactionType.BET_WON);
            winTransaction.setAmount(amount * 2);
            winTransaction.setTimestamp(LocalDateTime.now());
            winTransaction.setUser(user);
            winTransaction.setBet(savedBet);
            transactionRepository.save(winTransaction);
        }

        return savedBet;
    }
}
