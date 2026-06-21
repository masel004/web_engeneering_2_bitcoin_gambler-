package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class BitcoinService {

    private final RestTemplate restTemplate;

    public BitcoinService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double getBitcoinPrice() {
        String url =
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("bitcoin")) {
            throw new RuntimeException("Failed to fetch Bitcoin price");
        }

        Map bitcoin = (Map) response.get("bitcoin");

        if (bitcoin == null || !bitcoin.containsKey("usd")) {
            throw new RuntimeException("Invalid Bitcoin price response");
        }

        return Double.parseDouble(bitcoin.get("usd").toString());
    }

    public Map getBitcoinHistory() {
        String url =
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7";

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null) {
            throw new RuntimeException("Failed to fetch Bitcoin history");
        }

        return response;
    }
}
