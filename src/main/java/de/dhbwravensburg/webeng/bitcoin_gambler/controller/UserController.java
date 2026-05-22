package de.dhbwravensburg.webeng.bitcoin_gambler.controller;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import de.dhbwravensburg.webeng.bitcoin_gambler.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }
}