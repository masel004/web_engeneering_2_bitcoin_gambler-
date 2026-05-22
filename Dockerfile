FROM ubuntu:latest
LABEL authors="boehm"

ENTRYPOINT ["top", "-b"]