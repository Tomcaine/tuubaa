package ping

import (
	"log"

	discord "github.com/bwmarrin/discordgo"

	"tuubaa/lib"
	"tuubaa/lib/commands"
)

func Run(s *discord.Session) {
	log.Println("Ping loaded")

	// commands.Handle(session)
	// log.Fatalln("HELP!")
	// panic("HELPP!!")

	commands.Handle(s, []*commands.Command{&ping})
}

var ping = commands.Command{
	Structur: discord.ApplicationCommand{
		Name:        "ping",
		Description: "check response time",
	},
	Reaction: func(s *discord.Session, i *discord.InteractionCreate) {
		lib.DeferReply(s, i)
		content := s.Client.Timeout.String()
		lib.Reply(s, i, content)
	},
}
