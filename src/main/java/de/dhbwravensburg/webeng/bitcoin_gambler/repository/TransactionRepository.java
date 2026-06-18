package de.dhbwravensburg.webeng.bitcoin_gambler.repository;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByBetId(Long betId);
}
