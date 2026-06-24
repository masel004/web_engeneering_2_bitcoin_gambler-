package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.exception.ResourceNotFoundException;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getAllUsers_returnsAllUsers() {
        List<User> users = List.of(new User("alice", 100), new User("bob", 200));
        when(userRepository.findAll()).thenReturn(users);

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void getUserById_existingUser_returnsUser() {
        User user = new User("alice", 100);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertEquals("alice", result.getUsername());
    }

    @Test
    void getUserById_nonExistingUser_throwsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(1L));
    }

    @Test
    void createUser_duplicateUsername_throwsException() {
        User user = new User("alice", 100);
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> userService.createUser(user));
    }

    @Test
    void deleteUser_nonExistingUser_throwsException() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUser(1L));
    }
}
