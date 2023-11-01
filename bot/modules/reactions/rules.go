package reactions

import (
	"tuubaa/lib/commands"

	"github.com/bwmarrin/discordgo"
)

func Rules() {

}

var admin int64 = discordgo.PermissionAdministrator

var createRules = commands.Command{
	Structur: discordgo.ApplicationCommand{
		Name:                     "create_rules",
		Description:              "erstell die rollen!",
		DefaultMemberPermissions: &admin,
	},
	Reaction: func(s *discordgo.Session, i *discordgo.InteractionCreate) {

	},
}
