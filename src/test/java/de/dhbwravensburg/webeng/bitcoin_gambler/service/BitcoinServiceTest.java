package de.dhbwravensburg.webeng.bitcoin_gambler.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BitcoinServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private BitcoinService bitcoinService;

    @Test
    void getBitcoinPrice_validResponse_returnsPrice() {
        Map<String, Object> bitcoin = Map.of("usd", 50000.0);
        Map<String, Object> response = Map.of("bitcoin", bitcoin);

        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenReturn(response);

        double price = bitcoinService.getBitcoinPrice();

        assertEquals(50000.0, price);
    }

    @Test
    void getBitcoinPrice_nullResponse_throwsException() {
        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenReturn(null);

        assertThrows(RuntimeException.class, () -> bitcoinService.getBitcoinPrice());
    }
}
