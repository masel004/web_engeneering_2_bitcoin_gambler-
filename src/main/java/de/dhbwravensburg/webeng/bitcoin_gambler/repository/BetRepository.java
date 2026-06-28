package de.dhbwravensburg.webeng.bitcoin_gambler.repository;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BetRepository extends JpaRepository<Bet, Long> {

    List<Bet> findByUserId(Long userId);

    List<Bet> findByResolvedFalse();
}
