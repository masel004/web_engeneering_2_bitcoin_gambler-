package de.dhbwravensburg.webeng.bitcoin_gambler.repository;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
