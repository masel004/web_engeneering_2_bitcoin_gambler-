package de.dhbwravensburg.webeng.bitcoin_gambler.repository;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}