package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.BetRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BetService {

    private final BetRepository betRepository;
    private final UserRepository userRepository;
    private final BitcoinService bitcoinService;

    public BetService(BetRepository betRepository,
                      UserRepository userRepository,
                      BitcoinService bitcoinService) {

        this.betRepository = betRepository;
        this.userRepository = userRepository;
        this.bitcoinService = bitcoinService;
    }

    public List<Bet> getAllBets() {
        return betRepository.findAll();
    }

    public Bet placeBet(Long userId, double amount, String prediction) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        if (user.getBalance() < amount) {
            throw new RuntimeException("Not enough balance");
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

        userRepository.save(user);

        return betRepository.save(bet);
    }
}