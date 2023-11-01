package reactions

import (
	"log"
	"tuubaa/lib/commands"

	"github.com/bwmarrin/discordgo"
)

func Run(s *discordgo.Session) {
	log.Println("Reactions loaded")

	commands.Handle(s, []*commands.Command())
}
