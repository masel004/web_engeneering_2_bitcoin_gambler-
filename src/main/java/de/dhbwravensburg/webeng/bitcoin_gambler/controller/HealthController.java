package de.dhbwravensburg.webeng.bitcoin_gambler.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public HealthStatus health(){

        TrackedLiveBitcoinCourse = new TrackedLiveBitcoinCourse();
        TrackedLiveBitcoinCourse.set


        return new HealthStatus(
                "UP",
                "BitCoin Gambler",
                "0.1.0"
        );

    }
}
