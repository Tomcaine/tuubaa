package bot

import (
	"log"
	"os"

	"github.com/bwmarrin/discordgo"
)

var s *discordgo.Session

func Run() *discordgo.Session {
	var err error

	s, err = discordgo.New(
		"Bot " + os.Getenv("TOKEN"),
	)
	if err != nil {
		log.Fatal("Invalid Token: ", err)
	}

	err = s.Open()
	if err != nil {
		log.Fatal("Could not open Session: ", err)
	}

	log.Println("The Bot is online")
	go Handle(s)

	return s
}
