package main

import (
	"log"
	"os"
	"os/signal"

	"github.com/joho/godotenv"

	"tuubaa/bot"
)

func main() {
	// load dotenv
	err := godotenv.Load()
	if err != nil {
		log.Fatal("No .env file")
	}

	session := bot.Run()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	session.Close()
	//
	// sc := make(chan os.Signal, 1)
	// signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	// <-sc
}
