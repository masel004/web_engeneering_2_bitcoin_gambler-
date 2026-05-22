package de.dhbwravensburg.webeng.bitcoin_gambler.controller;

import de.dhbwravensburg.webeng.bitcoin_gambler.service.BitcoinService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class BitcoinController {

    private final BitcoinService bitcoinService;

    public BitcoinController(BitcoinService bitcoinService) {
        this.bitcoinService = bitcoinService;
    }

    @GetMapping("/bitcoin-price")
    public Map<String, Double> getBitcoinPrice() {

        double price = bitcoinService.getBitcoinPrice();

        return Map.of("bitcoinPrice", price);
    }

    @GetMapping("/bitcoin-history")
    public Map getBitcoinHistory() {

        return bitcoinService.getBitcoinHistory();
    }
}