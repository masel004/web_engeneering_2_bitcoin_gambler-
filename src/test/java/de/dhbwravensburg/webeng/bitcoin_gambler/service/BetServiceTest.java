package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.exception.InsufficientBalanceException;
import de.dhbwravensburg.webeng.bitcoin_gambler.exception.ResourceNotFoundException;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.BetRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.TransactionRepository;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BetServiceTest {

    @Mock
    private BetRepository betRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BitcoinService bitcoinService;

    @InjectMocks
    private BetService betService;

    @Test
    void placeBet_insufficientBalance_throwsException() {
        User user = new User("alice", 50);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(InsufficientBalanceException.class,
                () -> betService.placeBet(1L, 100, "up", "5m"));
    }

    @Test
    void placeBet_userNotFound_throwsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> betService.placeBet(1L, 100, "up", "5m"));
    }

    @Test
    void placeBet_sufficientBalance_createsPendingBet() {
        User user = new User("alice", 500);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(bitcoinService.getBitcoinPrice()).thenReturn(60000.0);
        when(betRepository.save(any(Bet.class))).thenAnswer(i -> i.getArgument(0));

        Bet result = betService.placeBet(1L, 100, "up", "5m");

        assertNotNull(result);
        assertEquals(100, result.getAmount());
        assertEquals("up", result.getPrediction());
        assertEquals("5m", result.getTimeframe());
        assertEquals(60000.0, result.getPriceAtBet());
        assertFalse(result.isResolved());
        assertEquals(400, user.getBalance());
        verify(bitcoinService).getBitcoinPrice();
    }
}
