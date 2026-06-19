package de.dhbwravensburg.webeng.bitcoin_gambler.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
