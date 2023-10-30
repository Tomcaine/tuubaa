package commands

import (
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/samber/lo"

	"tuubaa/config"
)

type Command struct {
	Structur discordgo.ApplicationCommand
	Reaction func(session *discordgo.Session, interaction *discordgo.InteractionCreate)
}

func Handle(session *discordgo.Session, commands []*Command) {
	// TODO: Error Handler for Commands
	defer func() {
		if r := recover(); r != nil {
			log.Println("Programm panicked!: ", r)
		}
	}()

	appId := config.Setting.AppID
	guildId := config.Setting.GuildID

	createdCommands, err := session.ApplicationCommandBulkOverwrite(
		appId,
		guildId,
		lo.Map(
			commands,
			func(command *Command, _ int) *discordgo.ApplicationCommand {
				return &command.Structur
			},
		),
	)

	println("list: ", createdCommands[0].ID)

	reactionsMapped := make(
		map[string]func(session *discordgo.Session, interaction *discordgo.InteractionCreate),
	)

	for _, createdCommand := range createdCommands {
		for _, command := range commands {
			reactionsMapped[createdCommand.ID] = command.Reaction
		}
	}

	session.AddHandler(func(session *discordgo.Session, interaction *discordgo.InteractionCreate) {
		defer func() {
			if r := recover(); r != nil {
				log.Println("Panic add Command Handler!: ", r)
			}
		}()
		reaction := reactionsMapped[interaction.ApplicationCommandData().ID]
		reaction(session, interaction)
		// for _, command := range commands {

		// if interaction.ApplicationCommandData().ID != command.Structur.ID {
		// 	log.Println(interaction.ApplicationCommandData().ID)
		// 	continue
		// }
		// command.Reaction(session, interaction)
		// }
	})

	if err != nil {
		log.Fatal("Error Command: ", err)
	}
}
