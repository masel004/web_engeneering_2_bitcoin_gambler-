package de.dhbwravensburg.webeng.bitcoin_gambler.controller;

import de.dhbwravensburg.webeng.bitcoin_gambler.dto.DepositRequest;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.Transaction;
import de.dhbwravensburg.webeng.bitcoin_gambler.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUserId(@PathVariable Long userId) {
        return transactionService.getTransactionsByUserId(userId);
    }

    @PostMapping("/deposit")
    public ResponseEntity<Transaction> deposit(@Valid @RequestBody DepositRequest request) {
        Transaction transaction = transactionService.deposit(
                request.getUserId(),
                request.getAmount()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }
}
