package de.dhbwravensburg.webeng.bitcoin_gambler.controller;

import de.dhbwravensburg.webeng.bitcoin_gambler.model.Bet;
import de.dhbwravensburg.webeng.bitcoin_gambler.service.BetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bets")
public class BetController {

    private final BetService betService;

    public BetController(BetService betService) {
        this.betService = betService;
    }

    @GetMapping
    public List<Bet> getAllBets() {
        return betService.getAllBets();
    }

    @PostMapping
    public Bet placeBet(@RequestBody Bet bet) {

        return betService.placeBet(
                bet.getUser().getId(),
                bet.getAmount(),
                bet.getPrediction()
        );
    }
}