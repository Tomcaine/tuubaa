package bot

import (
	"log"

	"github.com/bwmarrin/discordgo"

	"tuubaa/bot/modules/ping"
)

func Handle(session *discordgo.Session) {
	defer func() {
		if r := recover(); r != nil {
			log.Println("Programm panicked!: ", r)
		}
	}()
	ping.Run(session)
}
