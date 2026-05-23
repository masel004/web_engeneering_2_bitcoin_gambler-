package de.dhbwravensburg.webeng.bitcoin_gambler.repository;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BetRepository extends JpaRepository<Bet, Long> {

}