package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }
}