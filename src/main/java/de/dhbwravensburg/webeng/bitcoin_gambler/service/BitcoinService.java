package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;

@Service
public class BitcoinService {

    private final RestTemplate restTemplate;

    private double cachedPrice;
    private Map cachedHistory;
    private Instant priceLastFetched = Instant.EPOCH;
    private Instant historyLastFetched = Instant.EPOCH;

    private static final long CACHE_SECONDS = 60;

    public BitcoinService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double getBitcoinPrice() {
        if (Instant.now().minusSeconds(CACHE_SECONDS).isBefore(priceLastFetched) && cachedPrice > 0) {
            return cachedPrice;
        }

        String url =
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("bitcoin")) {
            if (cachedPrice > 0) return cachedPrice;
            throw new RuntimeException("Failed to fetch Bitcoin price");
        }

        Map bitcoin = (Map) response.get("bitcoin");

        if (bitcoin == null || !bitcoin.containsKey("usd")) {
            if (cachedPrice > 0) return cachedPrice;
            throw new RuntimeException("Invalid Bitcoin price response");
        }

        cachedPrice = Double.parseDouble(bitcoin.get("usd").toString());
        priceLastFetched = Instant.now();
        return cachedPrice;
    }

    public Map getBitcoinHistory() {
        if (Instant.now().minusSeconds(CACHE_SECONDS).isBefore(historyLastFetched) && cachedHistory != null) {
            return cachedHistory;
        }

        String url =
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1";

        Map response = restTemplate.getForObject(url, Map.class);

        if (response == null) {
            if (cachedHistory != null) return cachedHistory;
            throw new RuntimeException("Failed to fetch Bitcoin history");
        }

        cachedHistory = response;
        historyLastFetched = Instant.now();
        return cachedHistory;
    }
}
