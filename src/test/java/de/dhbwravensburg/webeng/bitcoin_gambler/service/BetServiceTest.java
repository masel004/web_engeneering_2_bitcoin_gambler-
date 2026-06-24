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

    @InjectMocks
    private BetService betService;

    @Test
    void placeBet_insufficientBalance_throwsException() {
        User user = new User("alice", 50);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertThrows(InsufficientBalanceException.class,
                () -> betService.placeBet(1L, 100, "up"));
    }

    @Test
    void placeBet_userNotFound_throwsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> betService.placeBet(1L, 100, "up"));
    }

    @Test
    void placeBet_sufficientBalance_createsBet() {
        User user = new User("alice", 500);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(betRepository.save(any(Bet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Bet result = betService.placeBet(1L, 100, "up");

        assertNotNull(result);
        assertEquals(100, result.getAmount());
        assertEquals("up", result.getPrediction());
        verify(userRepository).save(user);
        verify(betRepository).save(any(Bet.class));
    }
}
