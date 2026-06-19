package de.dhbwravensburg.webeng.bitcoin_gambler.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }
}
