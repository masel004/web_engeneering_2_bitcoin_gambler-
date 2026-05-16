package de.dhbwravensburg.webeng.bitcoin_gambler.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private double balance;

    public User() {
    }

    public User(String username, double balance) {
        this.username = username;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public double getBalance() {
        return balance;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}