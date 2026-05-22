package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class BitcoinService {

    public double getBitcoinPrice() {

        String url =
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";

        RestTemplate restTemplate = new RestTemplate();

        Map response = restTemplate.getForObject(url, Map.class);

        Map bitcoin = (Map) response.get("bitcoin");

        return Double.parseDouble(
                bitcoin.get("usd").toString()
        );
    }

    public Map getBitcoinHistory() {

        String url =
                "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7";

        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForObject(url, Map.class);
    }
}