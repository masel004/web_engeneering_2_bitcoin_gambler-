package de.dhbwravensburg.webeng.bitcoin_gambler.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bets")
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;

    private String prediction;

    private boolean won;

    @ManyToOne
    private User user;

    public Bet() {
    }

    public Long getId() {
        return id;
    }

    public double getAmount() {
        return amount;
    }

    public String getPrediction() {
        return prediction;
    }

    public boolean isWon() {
        return won;
    }

    public User getUser() {
        return user;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public void setWon(boolean won) {
        this.won = won;
    }

    public void setUser(User user) {
        this.user = user;
    }
}