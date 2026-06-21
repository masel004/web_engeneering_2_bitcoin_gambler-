package de.dhbwravensburg.webeng.bitcoin_gambler.controller;

import de.dhbwravensburg.webeng.bitcoin_gambler.dto.BetRequest;
import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import de.dhbwravensburg.webeng.bitcoin_gambler.service.BetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
public class BetController {

    private final BetService betService;

    public BetController(BetService betService) {
        this.betService = betService;
    }

    @GetMapping
    public List<Bet> getAllBets() {
        return betService.getAllBets();
    }

    @GetMapping("/{id}")
    public Bet getBetById(@PathVariable Long id) {
        return betService.getBetById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Bet> getBetsByUserId(@PathVariable Long userId) {
        return betService.getBetsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Bet> placeBet(@Valid @RequestBody BetRequest request) {
        Bet bet = betService.placeBet(
                request.getUserId(),
                request.getAmount(),
                request.getPrediction()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(bet);
    }
}
